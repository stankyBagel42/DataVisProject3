class ChordDiagram{
    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 1000,
            containerHeight: _config.containerHeight || 800,
            margin: _config.margin || { top: 10, right: 5, bottom: 75, left: 40 },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15
        }

        var matrix = [
            [0,169,171,86,56,31,26],
            [169,0,174,43,41,23,21],
            [171,174,0,35,54,27,16],
            [86,43,35,0,51,51,36],
            [56,41,54,51,0,31,9],
            [31,23,27,51,31,0,10],
            [26,21,16,36,9,10,0]
        ];

        this.initVis(matrix);
    }

    initVis(matrix) {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        var colorScale = d3.scaleOrdinal(["Adora", "Glimmer", "Bow", "Catra", "Entrapta", "Scorpia", "Shadow Weaver"],
            ["gold", "magenta", "red", "salmon", "mediumorchid", "maroon", "black"]);
        var Names = ["Adora", "Glimmer", "Bow", "Catra", "Entrapta", "Scorpia", "Shadow Weaver"];

        vis.svg = d3.select("#chordDiagram")
            .append("svg")
                .attr("id", "theChordDiagramSVG")
                .attr("width", vis.width)
                .attr("height", vis.height)
            .append("g")
                .attr("transform", "translate(300,250)")

        // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
        vis.res = d3.chord()
            .padAngle(0.05)     // padding between entities (black arc)
            .sortSubgroups(d3.descending)
            (matrix)

        // add the groups on the inner part of the circle
        vis.svg
            .datum(vis.res)
            .append("g")
            .selectAll("g")
            .data(function(d) { return d.groups; })
            .enter()
            .append("g")
            .append("path")
                .style("fill", d => colorScale(Names[d.index]))
                .style("stroke", "black")
                .attr("d", d3.arc()
                .innerRadius(200)
                .outerRadius(210)
                )

        
        // Add labels to the groups
        vis.svg
            .datum(vis.res)
            .append("g")
            .selectAll("text")
            .data(function (d) { return d.groups; })
            .enter()
            .append("text")
            .attr("dy", ".35em") // Adjust vertical alignment
            .attr("transform", function (d) {
                // Calculate the midpoint of the arc
                const startAngle = d.startAngle;
                const endAngle = d.endAngle;
                const midAngle = (startAngle + endAngle) / 2;
                const outerRadius = 220; // Adjust based on your diagram's radius
                const x = outerRadius * Math.cos(midAngle - Math.PI / 2);
                const y = outerRadius * Math.sin(midAngle - Math.PI / 2);
                if (d.index == 1) {
                    return "translate(" + (x + 50) + "," + y + ")";
                }
                else {
                    return "translate(" + x + "," + y + ")"
                };
            })
            .attr("text-anchor", function (d) {
                // Determine the text anchor based on the midpoint angle
                const midAngle = (d.startAngle + d.endAngle) / 2;
                return (midAngle < -Math.PI / 2 || midAngle > Math.PI / 2) ? "end" : "start";
            })
            .text(function (d) { return Names[d.index]; });

            
        // Add the links between groups
        vis.svg
            .datum(vis.res)
            .append("g")
            .selectAll("path")
            .data(function(d) { return d; })
            .enter()
            .append("path")
                .attr("d", d3.ribbon()
                .radius(200)
                )
                .style("fill",  d => colorScale(Names[d.source.index]))
                .style("stroke", "black")
                .on('mouseenter', function (event, d) {
                    let tooltipContent = '';
                    tooltipContent = `<div class="tooltip-label">${Names[d.source.index]} and ${Names[d.target.index]}<br>
                        ${d.source.value.toLocaleString("en-US")} Scenes Together </div>`;
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY + 10) + 'px')
                        .html(tooltipContent);
                    d3.select(event.currentTarget)
                        .style("fill", "green");
                })
                .on('mouseleave', function () {
                    d3.select('#tooltip').style('opacity', 0);
                    d3.select(event.currentTarget)
                        .style("fill",  d => colorScale(Names[d.source.index]))

                });
        
    }

    updateVis(seasonSelect) {
        // This data was found using the interactions.py script in the python folder,
        // and a data sheet for each season (and all together) are stored in the data folder.
        console.log("here");
        console.log(seasonSelect);
        if (seasonSelect == 1) {
            console.log("here1")
            var matrix = [
                [0,68,54,35,17,4,8],
                [68,0,63,9,11,4,4],
                [54,63,0,5,8,4,3],
                [35,9,5,0,15,16,15],
                [17,11,8,15,0,11,3],
                [4,4,4,16,11,0,3],
                [8,4,3,15,3,3,0]
            ];
        }
        else if (seasonSelect == 2) {
            var matrix = [
                [0,31,30,6,3,9,1],
                [31,0,40,10,7,8,1],
                [30,40,0,10,7,8,1],
                [6,10,10,0,15,16,4],
                [3,7,7,15,0,9,1],
                [9,8,8,16,9,0,1],
                [1,1,1,4,1,1,0]
            ];
        }
        else if (seasonSelect == 3) {
            var matrix = [
                [0,19,19,14,4,5,6],
                [19,0,22,4,3,0,6],
                [19,22,0,6,2,1,5],
                [14,4,6,0,3,8,3],
                [4,3,2,3,0,2,0],
                [5,0,1,8,2,0,0],
                [6,6,5,3,0,0,0]
            ];
        }
        else if (seasonSelect == 4) {
            var matrix = [
                [0,32,34,2,6,5,6],
                [32,0,24,2,2,7,9],
                [34,24,0,2,7,4,4],
                [2,2,2,0,4,10,1],
                [6,2,7,4,0,4,1],
                [5,7,4,10,4,0,5],
                [6,9,4,1,1,5,0]
            ];
        }
        else if (seasonSelect == 5) {
            var matrix = [
                [0,19,34,29,26,8,5],
                [19,0,25,18,18,4,1],
                [34,25,0,12,30,10,3],
                [29,18,12,0,14,1,2],
                [26,18,30,14,0,5,3],
                [8,4,10,1,5,0,1],
                [5,1,3,2,3,1,0]
            ];
        }
        else {
            var matrix = [
                [0,169,171,86,56,31,26],
                [169,0,174,43,41,23,21],
                [171,174,0,35,54,27,16],
                [86,43,35,0,51,51,36],
                [56,41,54,51,0,31,9],
                [31,23,27,51,31,0,10],
                [26,21,16,36,9,10,0]
            ];
        }

        d3.select("#theChordDiagramSVG").remove();

        this.initVis(matrix);
    }
}
