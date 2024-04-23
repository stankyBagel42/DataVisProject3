class Barchart{
    constructor(_config, _data, _column, _displayString) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 710,
            containerHeight: _config.containerHeight || 210,
            margin: _config.margin || { top: 10, right: 5, bottom: 75, left: 40 },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.column = _column;
        this.displayString = _displayString;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.1);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0)
            .tickFormat(d => d)
            .tickPadding(10)
            .tickSizeInner(0);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0)
            .tickFormat(d => d);

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight+20);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top + 30})`);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        var margin = { top: 20, right: 30, bottom: 50, left: 30 }

        vis.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", (vis.width / 2) + margin.left)
            .attr("y", margin.top)
            .attr("font-size", "1.05em")
            .attr("font-weight", "bold")
            .attr("font-family", "times-new-roman")
            .text(this.displayString);
        vis.inReset = false;
    }

    updateVis() {
        let vis = this;

        vis.xScale.domain(vis.data.map(d => d.character));
        vis.yScale.domain([0, d3.max(vis.data, d => d[vis.column])]);
        if (vis.displayString === "Lines In Each Episode") {
            vis.xScale.domain(vis.data.map(d => d.episode));
        }

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        var colorScale = d3.scaleOrdinal(["Adora", "Glimmer", "Bow", "Catra", "Entrapta", "Scorpia", "Shadow Weaver", "Other"],
            ["gold", "magenta", "red", "salmon", "mediumorchid", "maroon", "black", "steelblue"]);

        if (vis.displayString === "Lines In Each Episode") {
            let bars = vis.chart.selectAll('.bar')
            .data(vis.data, d => d.episode)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(d.episode))
            .attr('width', vis.xScale.bandwidth())
            .attr('y', d => vis.yScale(d[vis.column]))
            .attr('height', d => vis.height - vis.yScale(d[vis.column]))
            .style('fill', '#69b3a2') 
            .on('mouseenter', function (event, d) {
                let tooltipContent = '';
                tooltipContent = `<div class="tooltip-label">Episode: ${d.episode}<br>Lines: ${d.lines}</div>`;
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px')
                    .html(tooltipContent);
                d3.select(event.currentTarget)
                    .style("fill", "#49970e");
            })
            .on('mouseleave', function () {
                d3.select('#tooltip').style('opacity', 0);
                d3.select(event.currentTarget)
                    .style("fill", "steelblue");
            });
        }
        else{
        let bars = vis.chart.selectAll('.bar')
            .data(vis.data, d => d.character)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(d.character))
            .attr('width', vis.xScale.bandwidth())
            .attr('y', d => vis.yScale(d[vis.column]))
            .attr('height', d => vis.height - vis.yScale(d[vis.column]))
            .style('fill', function(d) {
                let colorScaleDomain = colorScale.domain();
                if (colorScaleDomain.includes(d.character)) {
                    return colorScale(d.character);
                } else {
                    return '#69b3a2';
                }
            })
            .on('mouseenter', function (event, d) {
                let tooltipContent = '';
                if (vis.displayString === "Lines Over Entire Show" || vis.displayString === "Character Lines Over Each Season") {
                    tooltipContent = `<div class="tooltip-label">Character: ${d.character}<br>Lines: ${d.lines}</div>`;
                } else if (vis.displayString === "Episodes Appeared" || vis.displayString === "Episodes Character Appeared in Each Season") {
                    tooltipContent = `<div class="tooltip-label">Character: ${d.character}<br>Episodes: ${d.episodes}</div>`;
                } 
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px')
                    .html(tooltipContent);
                d3.select(event.currentTarget)
                    .style("fill", "#49970e");
            })
            .on('mouseleave', function () {
                d3.select('#tooltip').style('opacity', 0);
                d3.select(event.currentTarget)
                    .style("fill", "steelblue");
            });
        }

        vis.xAxisG.call(vis.xAxis)
            .selectAll('.tick text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');
        vis.yAxisG.call(vis.yAxis);
    }
}
