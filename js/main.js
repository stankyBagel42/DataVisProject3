let season = 1;
let season2 = 1;
let character = "Adora";

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
        data.filter(d => d.season === season2 && d.character === character),
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
        data.filter(d => d.season === season2 && d.character === character),
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

    console.log(characterSeasonLinesPerEpisode);
    console.log(characterSeasonLinesData); 

    characterSeasonLinesBarChart = new Barchart({ parentElement: "#characterSeasonLinesBarChart", containerHeight: 400 }, characterSeasonLinesData, "lines", "Lines In Each Episode");
    characterSeasonLinesBarChart.updateVis()
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