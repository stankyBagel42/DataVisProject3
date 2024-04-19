d3.csv('data/transcripts.csv')
  .then(data => {

    data.forEach(d => {
      d.season = +d.season;
      d.episode = +d.episode;
      d.scene = +d.scene;
      d.character = d.character;
      d.line = d.line;
    });

    const linesPerCharacter = d3.rollup(
        data,
        v => v.length,
        d => d.character
      );

    const formattedData = Array.from(linesPerCharacter, ([character, lines]) => ({ character, lines }));

    linesBarChart = new BarchartCustomizable({ parentElement: "#linesBarChart", containerHeight: 400 }, formattedData, "character", "Lines");
    linesBarChart.updateVis()
  })
  .catch(error => console.error(error));