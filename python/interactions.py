
# This is the python program we used to count the number of interactions between the main characters of the show

import csv

# All interaction counters will go in order of character with most lines:
# Adora, Glimmer, Bow, Catra, Entrapta, Scorpia, Shadow Weaver

interactionCounter = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
]

scenes = []

charactersInScene = [0, 0, 0, 0, 0, 0, 0]
i = 0

file = open('transcripts.csv', mode='r')

transcriptsReader = csv.reader(file)
transcriptLines = []

for line in transcriptsReader:
  transcriptLines.append(line)

file.close()

while int(transcriptLines[i][0]) != 5:
  i += 1

while int(transcriptLines[i][0]) == 5:

  charactersInScene = [0, 0, 0, 0, 0, 0, 0]
  sceneCounter = int(transcriptLines[i][2])

  while int(transcriptLines[i][2]) == sceneCounter:
    print(i)
    #print(transcriptLines[i])
    speaker = transcriptLines[i][3]

    if speaker == "Adora" and charactersInScene[0] == 0:
      charactersInScene[0] = 1
    elif speaker == "Glimmer" and charactersInScene[1] == 0:
      charactersInScene[1] = 1
    elif speaker == "Bow" and charactersInScene[2] == 0:
      charactersInScene[2] = 1
    elif speaker == "Catra" and charactersInScene[3] == 0:
      charactersInScene[3] = 1
    elif speaker == "Entrapta" and charactersInScene[4] == 0:
      charactersInScene[4] = 1
    elif speaker == "Scorpia" and charactersInScene[5] == 0:
      charactersInScene[5] = 1
    elif speaker == "Shadow Weaver" and charactersInScene[6] == 0:
      charactersInScene[6] = 1

    i += 1

    if i == 9353:
      break

  if i == 9353:
      break

  scenes.append(charactersInScene)

#print(scenes)
i = 0

for i in range(len(scenes)):
  for j in range(len(scenes[i])):
    if scenes[i][j] == 1:
      for k in range(len(scenes[i])):
        if k != j and scenes[i][k] == 1:
          interactionCounter[j][k] += 1

print(interactionCounter)

outputFile = open('season5Interactions.csv', mode='w')

for line in interactionCounter:
  outputFile.write(str(line[0]) + ',' + str(line[1]) + ',' + str(line[2]) + ',' + str(line[3]) + ',' + str(line[4]) + ',' + str(line[5]) + ',' + str(line[6]) + ',\n')

outputFile.close()


      

        

