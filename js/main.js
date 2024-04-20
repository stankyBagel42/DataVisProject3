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

    const overallLinesData = Array.from(linesPerCharacter, ([character, lines]) => ({ character, lines }));
    overallLinesData.sort((a, b) => b.lines - a.lines);

    linesBarChart = new BarchartCustomizable({ parentElement: "#linesBarChart", containerHeight: 400 }, overallLinesData, "lines", "Lines Over Entire Show");
    linesBarChart.updateVis()

    const episodesPerCharacter = d3.rollup(
      data,
      v => new Set(v.map(d => `${d.season}-${d.episode}`)).size,
      d => d.character
  );

    const overallEpisodesData = Array.from(episodesPerCharacter, ([character, episodes]) => ({ character, episodes }));
    overallEpisodesData.sort((a, b) => b.episodes - a.episodes);

    episodesBarChart = new BarchartCustomizable({ parentElement: "#episodesBarChart", containerHeight: 400 }, overallEpisodesData, "episodes", "Episodes Appeared");
    episodesBarChart.updateVis();

  })
  .catch(error => console.error(error));