let season = 1;
let season2 = 1;
let character = "Adora";
let stopWords = ['its', 'no', 'up', "what's", "we've", 'few', 'nor', 'through', "she'll", 'further', 'to', 'why', 'was', 'have', 'did', "they've", 'can', 'once', "they'll", 'not', 'most', 'ourselves', 'than', 'about', 'herself', 'just', 'down', 'it', 'how', 'in', "how's", 'having', 'has', 'of', 'his', "why's", 'where', 'any', "you'd", 'off', 'our', 'he', "we're", 'shall', "don't", 'when', 'had', 'below', 'there', 'would', "aren't", 'itself', "mustn't", 'their', 'then', 'i', 'until', 'cannot', "it's", 'is', "couldn't", 'before', 'such', 'very', "you'll", "he'd", 'because', 'some', "when's", "we'll", 'know', "here's", 'each', 'as', "can't", "you've", 'an', 'we', 'those', 'other', 'who', "won't", 'ours', 'that', 'from', 'himself', 'my', "didn't", 'yourself', 'doing', 'ought', "i'll", "we'd", 'be', 'own', 'here', 'too', 'she', "they're", "weren't", 'this', "shouldn't", 'again', 'during', 'above', 'you', 'f', "haven't", 'do', "doesn't", 'myself', 'ra', 'yours', "where's", 'may', "you're", 'go', 'at', 'while', 'against', 'out', 'been', "that's", 're', 'the', 'me', 'by', 'so', "he's", 'these', "hadn't", 'more', 'with', 'what', 'they', 'him', "he'll", "there's", 'theirs', 'but', 'whose', "wouldn't", 'whom', 'does', 'a', 'under', 'let', 'all', 'only', 'between', 'might', 'are', "let's", 'or', 'll', "wasn't", "hasn't", 'will', 'themselves', 'yourselves', "they'd", "who's", 'am', 'which', 'if', 'them', "i'd", 'her', 'and', "shan't", 'on', 'could', 'should', 'must', "i've", "isn't", 'get', 'into', 'were', 'hers', "she's", 'being', 'after', 'over', "she'd", 'same', "i'm", 'for', 'your', 'both'];
let minFontSize = 5;
let maxFontSize = 100;
let text = "";

d3.csv('data/transcripts.csv')
  .then(data => {

    data.forEach(d => {
      d.season = +d.season;
      d.episode = +d.episode;
      d.scene = +d.scene;
      d.character = d.character;
      d.line = d.line;
    });

    // overall lines
    const overallLinesPerCharacter = d3.rollup(
        data,
        v => v.length,
        d => d.character
      );

    const overallLinesData = Array.from(overallLinesPerCharacter, ([character, lines]) => ({ character, lines }));
    overallLinesData.sort((a, b) => b.lines - a.lines);

    linesBarChart = new Barchart({ parentElement: "#linesBarChart", containerHeight: 400 }, overallLinesData, "lines", "Lines Over Entire Show");
    linesBarChart.updateVis()

    // overall episodes
    const episodesPerCharacter = d3.rollup(
      data,
      v => new Set(v.map(d => `${d.season}-${d.episode}`)).size,
      d => d.character
    );
  
    const overallEpisodesData = Array.from(episodesPerCharacter, ([character, episodes]) => ({ character, episodes }));
    overallEpisodesData.sort((a, b) => b.episodes - a.episodes);

    episodesBarChart = new Barchart({ parentElement: "#episodesBarChart", containerHeight: 400 }, overallEpisodesData, "episodes", "Episodes Appeared");
    episodesBarChart.updateVis();
    
    // Extract the column containing the lines said by characters
    var linesColumn = data.map(function(d) {
      return d.line; // Replace "line_column_name" with the actual column name
    });

    // Join all the lines into a single string
    var allLines = linesColumn.join(" ");

    // Remove punctuation marks and tokenize the lines into words, preserving contractions
    var words = allLines.toLowerCase().match(/\b[\w']+\b/g); // This regex matches words and contractions

    // Count the frequency of each word
    var wordFrequency = {};
    words.forEach(function(word) {
      if (!stopWords.includes(word)) { // Check if the word is not a stop word
        if (wordFrequency[word]) {
            wordFrequency[word]++;
        } else {
            wordFrequency[word] = 1;
        }
    }
    });

    //season event listener
    d3.select("#season_attr").on("change", function() {
      season = +this.value;
      seasonLinesPerCharacter = d3.rollup(
        data.filter(d => d.season === season), 
        v => v.length,
        d => d.character
      );
      seasonLinesData = Array.from(seasonLinesPerCharacter, ([character, lines]) => ({ character, lines }));
      seasonLinesData.sort((a, b) => b.lines - a.lines);

      seasonLinesBarChart.data = seasonLinesData
      seasonLinesBarChart.updateVis() 
      
      seasonEpisodesPerCharacter = d3.rollup(
        data.filter(d => d.season === season), 
        v => new Set(v.map(d => `${d.season}-${d.episode}`)).size,
        d => d.character
      );
      seasonEpisodesData = Array.from(seasonEpisodesPerCharacter, ([character, episodes]) => ({ character, episodes }));
      seasonEpisodesData.sort((a, b) => b.episodes - a.episodes);

      seasonEpisodesBarChart.data = seasonEpisodesData
      seasonEpisodesBarChart.updateVis()
    });

    // season lines
    seasonLinesPerCharacter = d3.rollup(
      data.filter(d => d.season === season), 
      v => v.length,
      d => d.character
    );

    seasonLinesData = Array.from(seasonLinesPerCharacter, ([character, lines]) => ({ character, lines }));
    seasonLinesData.sort((a, b) => b.lines - a.lines);

    seasonLinesBarChart = new Barchart({ parentElement: "#seasonLinesBarChart", containerHeight: 400 }, seasonLinesData, "lines", "Lines Over Each Season");
    seasonLinesBarChart.updateVis()

    // season episodes
    seasonEpisodesPerCharacter = d3.rollup(
      data.filter(d => d.season === season), 
      v => new Set(v.map(d => `${d.season}-${d.episode}`)).size,
      d => d.character
    );

    seasonEpisodesData = Array.from(seasonEpisodesPerCharacter, ([character, episodes]) => ({ character, episodes }));
    seasonEpisodesData.sort((a, b) => b.episodes - a.episodes);

    seasonEpisodesBarChart = new Barchart({ parentElement: "#seasonEpisodesBarChart", containerHeight: 400 }, seasonEpisodesData, "episodes", "Episodes Appeared in Each Season");
    seasonEpisodesBarChart.updateVis()

    //character event listener
    d3.select("#char_attr").on("change", function() {
      character = this.value;
      characterSeasonLinesPerEpisode =  d3.rollup(
        data.filter(d => d.season === season2 && d.character === character && d.line.toLowerCase().includes(text)),
        v => v.length,
        d => d.episode 
    );
  
      const characterSeasonLinesData = Array.from(characterSeasonLinesPerEpisode, ([episode, count]) => ({ episode, lines: count }));

      characterSeasonLinesBarChart.data = characterSeasonLinesData
      characterSeasonLinesBarChart.updateVis() 
    });

    //season2 event listener
    d3.select("#season_attr2").on("change", function() {
      season2 = +this.value;
      characterSeasonLinesPerEpisode =  d3.rollup(
        data.filter(d => d.season === season2 && d.character === character && d.line.toLowerCase().includes(text)),
        v => v.length,
        d => d.episode 
    );
  
      const characterSeasonLinesData = Array.from(characterSeasonLinesPerEpisode, ([episode, count]) => ({ episode, lines: count }));

      characterSeasonLinesBarChart.data = characterSeasonLinesData
      characterSeasonLinesBarChart.updateVis() 
    });

    //textbox filter
    d3.select("#textbox").on("input", function() {
      text = this.value.toLowerCase();
      characterSeasonLinesPerEpisode =  d3.rollup(
        data.filter(d => d.season === season2 && d.character === character && d.line.toLowerCase().includes(text)),
        v => v.length,
        d => d.episode 
    );
  
      const characterSeasonLinesData = Array.from(characterSeasonLinesPerEpisode, ([episode, count]) => ({ episode, lines: count }));

      characterSeasonLinesBarChart.data = characterSeasonLinesData
      characterSeasonLinesBarChart.updateVis() 

    });

    // character lines per episode for season
    characterSeasonLinesPerEpisode =  d3.rollup(
      data.filter(d => d.season === season2 && d.character === character),
      v => v.length,
      d => d.episode 
  );

    const characterSeasonLinesData = Array.from(characterSeasonLinesPerEpisode, ([episode, count]) => ({ episode, lines: count }));

    characterSeasonLinesBarChart = new Barchart({ parentElement: "#characterSeasonLinesBarChart", containerHeight: 400 }, characterSeasonLinesData, "lines", "Lines In Each Episode");
    characterSeasonLinesBarChart.updateVis()
    // Define minimum font size, maximum font size, and maximum frequency
    var maxFrequency = Math.max(...Object.values(wordFrequency)); // Maximum frequency

    // Convert wordFrequency object into an array of objects with word, size, and frequency properties,
    // while filtering out stop words
    var wordCloudData = Object.keys(wordFrequency)
      .map(function(word) {
          var frequency = wordFrequency[word];
          // Scale font size based on frequency
          var fontSize = minFontSize + (frequency / maxFrequency) * (maxFontSize - minFontSize);
          return { text: word, size: fontSize, frequency: frequency };
      });
    // Convert wordFrequency object into an array of objects with word, size, and frequency properties
    var wordCloudData = Object.keys(wordFrequency).map(function(word) {
        var frequency = wordFrequency[word];
        // Scale font size based on frequency
        var fontSize = (frequency / maxFrequency) * maxFontSize;
        return { text: word, size: fontSize, frequency: frequency };
    });
    wordCloud = new WordCloud({parentElement: "#wordCloud", containerHeight: 400, containerWidth: 800}, wordCloudData);
    characterSeasonLinesBarChart.updateVis();

  })
  .catch(error => console.error(error));

  d3.csv('data/allSeasonsInteractions.csv')
  .then(data2 => {

    data2.forEach(d => {
      d.Adora = +d.Adora;
      d.Glimmer = +d.Glimmer;
      d.Bow = +d.Bow;
      d.Catra = +d.Catra;
      d.Entrapta = +d.Entrapta;
      d.Scorpia =+d.Scorpia;
      d.ShadowWeaver = +d.ShadowWeaver;
    })

    chordDiagram = new ChordDiagram({parentElement: "#chordDiagram"}, data2)
  })
  .catch(error => console.error(error));