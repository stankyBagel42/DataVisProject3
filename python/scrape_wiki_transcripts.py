import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import bs4
import pandas as pd
from bs4 import BeautifulSoup

import requests as req


def split_names(names_string):
    # Define regular expression patterns for splitting
    pattern_and = r'\s+(?:and|&)\s+'
    pattern_slash = r'\s*/\s*'
    pattern_comma = r',\s*'

    # Split the string using the 'and', '&' and '/' patterns
    names_split_and = re.split(pattern_and, names_string)

    # Initialize a list to store individual names
    individual_names = []

    # Split each part obtained from 'and' split using the comma and '/' patterns
    for part in names_split_and:
        # Split using comma pattern
        names_split_comma = re.split(pattern_comma, part)
        # Further split using slash pattern for each name from comma split
        for name in names_split_comma:
            individual_names.extend(re.split(pattern_slash, name))

    return individual_names
def remove_descriptions(name):
    # regex to match things in brackets
    pattern = r'\s*\([^)]*\)|\s*\[[^\]]*\]|\s*\{[^\}]*\}'

    # Remove the matched patterns from the name
    cleaned_name = re.sub(pattern, '', name)

    return cleaned_name.strip()


def get_episode_lines(website_content: BeautifulSoup, season: int, episode: int, name_subs:dict[str,str]) -> list[dict]:
    rows = []
    if website_content:
        # Creating a BeautifulSoup object and specifying the parser
        S = BeautifulSoup(website_content.content, 'html.parser')
        episode_content = S.find_all('div', class_='mw-parser-output')[0]
        scene_count = 0
        for c in episode_content.children:
            # the lines are stored in paragraph elements
            if c.name == 'p':
                line = c.get_text().strip()
                line = line.replace('\xa0',' ')
                line = line.replace('’',"'")
                # sometimes authors put the word scene in descriptions of a line (like "Bob: Hi [scene pans out to ...])
                # so we have to check for if the first character is a common starting character for notes and if there
                # is a colon denoting the speaker
                if 'scene' in line.lower():
                    if ':' in line and line[0] not in '([{-=·':
                        pass
                    else:
                        scene_count += 1
                        continue

                if 'credits roll' in line.lower():
                    break

                # skip scene descriptions/unknown characters and empty lines
                if len(line) == 0:
                    continue
                elif line[0] == '{':
                    continue
                elif line[0] == '[':
                    continue

                # if ':' not in line:
                #     print(f"CONTINUATION? (s{season}e{episode}): {line}")
                split_line = line.split(":")

                character = split_line[0]

                line_text = ':'.join(split_line[1:])

                # remove descriptions
                line_text = remove_descriptions(line_text).strip()

                if len(line_text) == 0:
                    continue

                character = remove_descriptions(character)
                character.strip("*\n\t ")
                if ':' not in line:
                    continue
                if len(character) == 0 or not character[0].isalpha():
                    continue
                if 'and' in character:
                    names = split_names(character)
                    character = names[0]

                    # for each name in the list
                    for name in names[1:]:
                        if len(name) == 0:
                            continue
                        # substitute the name, if it doesn't exist in the dictionary, keep it the same
                        name = name_subs.get(name, name)
                        line_dict = {
                            'season': season,
                            'episode': episode,
                            'scene': scene_count,
                            'character': name,
                            'line': line_text
                        }
                        rows.append(line_dict)
                if ',' in character:
                    comma_idx = character.find(',')
                    character = character[:comma_idx]

                # substitute the name, if it doesn't exist in the dictionary, keep it the same
                character = name_subs.get(character, character)

                line_dict = {
                    'season': season,
                    'episode': episode,
                    'scene': scene_count,
                    'character': character,
                    'line': line_text
                }
                rows.append(line_dict)

            # scene changes are <ul> tags in the middle of the data
            elif c.name == 'ul':
                scene_count += 1
    else:
        return False
    return rows


if __name__ == '__main__':
    OUT_PATH = Path(r"..\data\transcripts.csv")
    # minimum number of lines for a character to be included (other characters will be renamed to "Other")
    MIN_LINES = 50
    episode_list_doc = req.get("https://she-raandtheprincessesofpower.fandom.com/wiki/Episode_Transcript_List")
    substitutions_df = pd.read_csv(Path(r"..\data\substitutions.csv"))
    list_soup = BeautifulSoup(episode_list_doc.content, 'html.parser')
    count = 0
    main_page = list_soup.find_all('div', class_='mw-parser-output')[0]

    # list of dataframes to combine into the overall CSV at the end
    dataframes = []

    substitutions = {}
    for i, row in substitutions_df.iterrows():
        substitutions[row['old']] = row['new']

    # each season has an ordered list
    for season_num, season in enumerate(main_page.find_all_next('ol'), 1):
        ep_num = 1
        for child in season.children:
            if isinstance(child, bs4.NavigableString):
                continue
            link = next(child.children)

            # Extract the URL from the link
            url = "https://she-raandtheprincessesofpower.fandom.com" + link['href']
            # Fetch the content of the linked page
            linked_page = req.get(url)
            lines = get_episode_lines(linked_page, season_num, ep_num, substitutions)
            df = pd.DataFrame(lines)
            dataframes.append(df)

            # failed to process
            if not lines:
                print(f"FAILED TO GET EPISODE {link['href']}")
                continue
            ep_num += 1


    dataframe = pd.concat(dataframes, axis=0)

    character_line_counts = defaultdict(int)
    for i,row in dataframe.iterrows():
        character_line_counts[row['character']] += 1

    # get all characters that need to be renamed
    to_rename = [key for key, val in character_line_counts.items() if val < MIN_LINES]

    # rename all characters in that list
    dataframe.loc[dataframe['character'].isin(to_rename), 'character'] = 'Other'

    dataframe.to_csv(OUT_PATH, index=False)
