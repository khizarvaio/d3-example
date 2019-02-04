const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = () => {
    req = JSON.parse(req.responseText);
    
const dataset = req;

let width = window.innerWidth - 100;
const height = 400;
const margin = 40;
    
if (window.innerWidth < 700) {
    width = 800;
} 
    
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    
const svg = d3.select('body')
                .append('svg')
                .attr('id', 'chart')
                .attr('width', width)
                .attr('height', height);

const legend = d3.select('#container')
                    .append('svg')
                    .attr('id', 'legend')
                    .attr('width', 80)
                    .attr('height', 20);
                    
const description = d3.select('#description')
                        .html(dataset.monthlyVariance[0].year + ' - ' + dataset.monthlyVariance[dataset.monthlyVariance.length-1].year  + '<br>Base Temperature: ' + dataset.baseTemperature + '℃ <br><br>' + 'Legend');
    
const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset.monthlyVariance,(d) => d.year), d3.max(dataset.monthlyVariance,(d) => d.year)])
                    .range([margin, width-5]);
    
const yScale = d3.scaleLinear()
                    .domain([0, months.length-1])
                    .range([5, height-margin*2]);
    
const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'));

const yAxis = d3.axisLeft(yScale)
                .tickFormat((d, i) => months[d]);
    
const tooltip = d3.select('#container')
                    .append('div')
                    .attr('id', 'tooltip');

svg.append('g')
    .attr('transform', 'translate(0, ' + (height - margin) + ')')
    .attr('id', 'x-axis')
    .style('font-size', '13px')
    .call(xAxis);

svg.append('g')
    .attr('transform', 'translate(38, 0)')
    .attr('id', 'y-axis')
    .style('font', '11px times')
    .style('font-family', 'Lato')
    .call(yAxis);
   
svg.selectAll('rect')
    .data(dataset.monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d, i) => xScale(d.year))
    .attr('y', (d) => yScale(d.month-1))
    .attr('width', (width-margin) / (dataset.monthlyVariance[dataset.monthlyVariance.length-1].year - dataset.monthlyVariance[0].year))
    .attr('height', (d) => (height-margin) / 12)
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance)
    .attr('fill', (d) => { if (d.variance < -2) return '#2bc32b' 
                            else if (d.variance < 0.4) return '#C7F855'
                            else if (d.variance >= 0.4 && d.variance <= 0.7) return '#FEB92A'
                            else if (d.variance >= 0.7) return '#F95504'
                        })
    .on('mouseover', (d) => {
        tooltip
            .style('left', d3.event.pageX - 80 + 'px')
            .style('top', d3.event.pageY + 15 + 'px')
            .style('padding', '1rem')
            .style('visibility', 'visible')
            .attr('data-year', d.year)
            .html(months[d.month-1] + ', ' + d.year + '<br>' + '<b>Temperature:</b> ' + (dataset.baseTemperature + d.variance).toFixed(2) + '℃')
    })
    .on('mouseout', (d) => {
        tooltip.style('visibility', 'hidden');
})
const colors = ['#2bc32b', '#C7F855', '#FEB92A', '#F95504'];
const legendText = ['minor', 'moderate', 'major', 'critical'];

const legendTooltip = d3.select('#container')
                        .append('div')
                        .attr('id', 'legendTooltip');
      
legend.selectAll('rect')
        .data(colors)
        .enter()
        .append('rect')
        .attr('class', 'legend_rect')
        .attr('x', (d, i) => 20 * i )
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 20)
        .style('z-index', '555')
        .style('stroke', '1')
        .style('stroke', 'black')
        .attr('fill', (d, i) => colors[i])
        .on('mouseover', (d, i) => {
            legendTooltip
                .style('left', 15 + d3.event.pageX + 'px')
                .style('top', d3.event.pageY + 'px')
                .style('color', '#fff')
                .style('visibility', 'visible')
                .html(legendText[i])
        })
        .on('mouseout', (d, i) => legendTooltip.style('visibility', 'hidden'))
    
}
