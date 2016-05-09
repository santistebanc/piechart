import React from 'react';
import d3 from 'd3';

require('./BarChartStyles.css');

export default class BarChart extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    console.log('mount');
    this.createChart(this.props);
  }
  shouldComponentUpdate(nextProps) {
    this.updateChart(nextProps);
    return false;
  }
  render () {
    //this is just run once when mounting for first time
    return (
      <div ref="wrapper">
        <h3/>
        <svg/>
      </div>
    );
  }
  createChart(props){ //run once after mounting
    this.place = d3.select(this.refs.wrapper);
    this.chartframe = this.place.select('svg').attr('width', props.width).attr('height', props.height).attr('class', 'chart');
    this.framewidth = props.width;
    this.frameheight = props.height;
    this.chartheight = this.frameheight - props.margin.top - props.margin.bottom;
    this.chartwidth = this.framewidth - props.margin.left - props.margin.right;

    this.verticalGuide = this.chartframe.append('g').attr('transform', 'translate(' + props.margin.left + ', ' + props.margin.top + ')');
    this.chartspace = this.chartframe.append('g').attr('transform', 'translate(' + props.margin.left + ', ' + props.margin.top + ')');
    this.horizontalGuide = this.chartframe.append('g').attr('transform', 'translate(' + props.margin.left + ', ' + (this.chartheight + props.margin.top) + ')');
    this.updateChart(props);
  }
  updateChart(props){
    //this should be called everytime something in the chart has to change
    this.updateTitle(props);
    this.updateBars(props);
  }
  updateTitle(props){
    this.place.select("h3").text(props.title);
  }
  updateBars(props){
    let dynamicColor;
    let yScale = d3.scale.linear().domain([0, d3.max(props.data,d=>d.value)]).range([0, this.chartheight])
    let xScale = d3.scale.ordinal().domain(props.data.map(d=>d.name)).rangeBands([0, this.chartwidth])
    let colors = d3.scale.linear()
    .domain([0, props.data.length * 0.33, props.data.length * 0.66, props.data.length])
    .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1'])

    let update_rect = this.chartspace.selectAll('rect').data(props.data);
    let enter_rect = update_rect.enter().append('rect');
    let exit_rect = update_rect.exit().remove();

    enter_rect.attr('class','chartbar')
    .style('fill',(data, i)=>{return data.color || colors(i)})
    .attr('height', 0)
    .attr('y', this.chartheight)
    .on('mouseover', function(data) {
      dynamicColor = this.style.fill;
        d3.select(this).classed("mouseover", true).style('fill',d3.rgb(dynamicColor).darker(0.1));
    })
    .on('mouseout', function (data) {
        d3.select(this).classed("mouseover", false).style('fill',dynamicColor);
    })
    update_rect.attr('width', xScale.rangeBand())
    .attr('x', (data, i)=>{return xScale(data.name)})
    .transition()
    .attr('height', data=>{return yScale(data.value)})
    .attr('y', data=>{return this.chartheight - yScale(data.value)})
    .delay((data, i)=>{return i * 20})
    .duration(500)
    .ease('sin');

    let verticalGuideScale = d3.scale.linear().domain([0, d3.max(props.data,d=>d.value)]).range([this.chartheight, 0])
    let vAxis = d3.svg.axis().scale(verticalGuideScale).orient('left').ticks(this.props.ticks);

    vAxis(this.verticalGuide);
    this.verticalGuide.selectAll('path').attr('class','axisline');
    this.verticalGuide.selectAll('line').attr('class','axislinetick');

    let hAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(props.data.size);
    hAxis(this.horizontalGuide)
    this.horizontalGuide.selectAll('path').attr('class','axisline');
    this.horizontalGuide.selectAll('line').attr('class','axislinetick');
  }
}


BarChart.propTypes = {
  // width: React.PropTypes.number,
  // height: React.PropTypes.number,
  // title: React.PropTypes.string,
};
BarChart.defaultProps = {
  data: [],
  margin: {top: 30, right: 10, bottom: 30, left: 50},
  width: 600,
  height: 400,
  title: 'Untitled',
  ticks: 5
};
