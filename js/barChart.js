class BarchartCustomizable {
    constructor(_config, _data, _column, _displayString) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 710,
            containerHeight: _config.containerHeight || 200,
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

        console.log(vis.data)
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
            .attr('height', vis.config.containerHeight);

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
            .text(this.displayString);
        vis.inReset = false;
    }

    updateVis() {
        let vis = this;

        // Set the scale input domains
        vis.xScale.domain(vis.data.map(d => d[vis.column]));
        vis.yScale.domain([0, d3.max(vis.data, d => d.lines)]);

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Add rectangles
        let bars = vis.chart.selectAll('.bar')
            .data(vis.data, d => d[vis.column])
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(d[vis.column]))
            .attr('width', vis.xScale.bandwidth())
            .attr('y', d => vis.yScale(d.lines))
            .attr('height', d => vis.height - vis.yScale(d.lines))
            .style('fill', 'steelblue') 
            .on('mouseenter', function (event, d) {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px')
                    .html(`<div class="tooltip-label">${vis.displayString}: ${d[vis.column]}<br>
                    Lines: ${d.lines}</div>`);
            })
            .on('mouseleave', function () {
                d3.select('#tooltip').style('opacity', 0);
            });

        vis.xAxisG.call(vis.xAxis)
            .selectAll('.tick text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');
        vis.yAxisG.call(vis.yAxis);
    }
}
