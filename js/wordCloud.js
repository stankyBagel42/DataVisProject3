let layout;
let chart;

class WordCloud{
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 710,
            containerHeight: _config.containerHeight || 200,
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

        chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top + 30})`);

        vis.xAxisG = chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = chart.append('g')
            .attr('class', 'axis y-axis');

        var margin = { top: 20, right: 30, bottom: 50, left: 30 }

        vis.inReset = false;
        vis.updateVis();
    }

    draw(words){       
        var width = layout.size()[0]/2;
        var height = layout.size()[1]/2;
        
        // Clear existing text elements representing words
        chart.selectAll("text").remove();

        // Append new text elements for the updated word cloud data
        chart
            .attr("transform", "translate(" +width + "," + height + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
        .text(function(d) { return d.text; });

    }
    updateVis() {
        let vis = this;

        layout = d3.layout.cloud()
            .size([vis.width, vis.height])
            .words(vis.data.map(function(d) { return {text: d.text, size:d.size}; }))
            .padding(5)        //space between words
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .fontSize(function(d) { return d.size; })
            .on('end',vis.draw);
        layout.start();
    }

}

