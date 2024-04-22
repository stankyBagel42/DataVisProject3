class ChordDiagram{
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 1000,
            containerHeight: _config.containerHeight || 1000,
            margin: _config.margin || { top: 10, right: 5, bottom: 75, left: 40 },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        var matrix = [
            [0,169,171,86,56,31,26],
            [169,0,174,43,41,23,21],
            [171,174,0,35,54,27,16],
            [86,43,35,0,51,51,36],
            [56,41,54,51,0,31,9],
            [31,23,27,51,31,0,10],
            [26,21,16,36,9,10,0]
        ];

        vis.svg = d3.select("#chordDiagram")
            .append("svg")
                .attr("width", vis.width)
                .attr("height", vis.height)
            .append("g")
                .attr("transform", "translate(220,220)")

        console.log(vis.data)
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
                .style("fill", "grey")
                .style("stroke", "black")
                .attr("d", d3.arc()
                .innerRadius(200)
                .outerRadius(210)
                )

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
                .style("fill", "#69b3a2")
                .style("stroke", "black");
    }

    updateVis() {}

    renderVis() {}
}
