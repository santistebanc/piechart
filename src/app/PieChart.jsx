import React from 'react';
import d3 from 'd3';

require('./PieChartStyles.css');

export default class PieChart extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
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
    this.legendboxwidth = 150;
    this.boxmargin = 5;
    this.chartheight = this.frameheight - props.margin.top - props.margin.bottom;
    this.chartwidth = this.framewidth - props.margin.left - props.margin.right;
    this.outerRadius = props.height/2.2;
    this.innerRadius = props.height/8;
    this.colors = d3.scale.linear()
    .domain([0, props.data.length * 0.33, props.data.length * 0.66, props.data.length])
    .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1']);
    this.chartspace = this.chartframe.append('g').attr('transform', 'translate(' + (props.margin.left+this.outerRadius) + ', ' + (props.margin.top+this.outerRadius) + ')');
    let donut = d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius).startAngle(0).endAngle(2*Math.PI);
    this.chartspace.append("path").attr('class','donut').attr('d',donut);

    this.legendspace = this.chartframe.append('g').attr('transform', 'translate(' + (props.width-props.margin.right-this.legendboxwidth) + ', ' + props.margin.top + ')');
    this.legendspace.append("rect").attr('class','legendbox').attr('width',this.legendboxwidth).attr('height',props.data.length*20+this.boxmargin*2);

    this.updateChart(props);
  }
  updateChart(props){
    //this should be called everytime something in the chart has to change
    this.updateTitle(props);
    this.updatePie(props);
    this.updateLegend(props);
  }
  updateTitle(props){
    this.place.select("h3").text(props.title);
  }
  updateLegend(props){
    let textsize = 20;
    let update_entry = this.legendspace.selectAll(".entry").data(props.data);
    let enter_entry = update_entry.enter().append("g").attr("class", "entry");
    let exit_entry = update_entry.exit().remove();

    enter_entry.append("rect").attr('class','legendsquare').attr('width',textsize).attr('height',textsize).attr('x',this.boxmargin).attr("y", (d,i)=>{return i*textsize+this.boxmargin}).style("fill", (d, i)=>this.colors(i));
    enter_entry.append("text").attr('class','legendtext').attr('height',textsize).attr('x',textsize+5+this.boxmargin).attr("y", (d,i)=>{return i*textsize+textsize-3+this.boxmargin}).text(d=>d.name);
  }
  updatePie(props){
    let dynamicColor;
    let arc = d3.svg.arc().outerRadius(this.outerRadius).innerRadius(this.innerRadius);
    var pie = d3.layout.pie().value(d=>d.value);

    let update_slice = this.chartspace.selectAll(".pieslice").data(pie(props.data));
    let enter_slice = update_slice.enter().append("g").attr("class", "pieslice");
    let exit_slice = update_slice.exit().remove();

    enter_slice.append("path").attr("class", "slice").style("fill", (d, i)=>this.colors(i))
      .on('mouseover', function(data) {
      dynamicColor = this.style.fill;
        d3.select(this).classed("mouseover", true).style('fill',d3.rgb(dynamicColor).darker(0.1));
      })
      .on('mouseout', function (data) {
        d3.select(this).classed("mouseover", false).style('fill',dynamicColor);
      })
      .transition().delay((d, i)=>{ return i * 400}).duration(500)
      .attrTween('d', d=>{
           var i = d3.interpolate(d.startAngle, d.endAngle);
           return function(t) {
               d.endAngle = i(t);
             return arc(d);
           }
    });

    update_slice.select(".slice").transition().duration(500)
    .attrTween('d', d=>{
         var i = d3.interpolate(d.startAngle, d.endAngle);
         return function(t) {
             d.endAngle = i(t);
           return arc(d);
         }
    });



  }
}

PieChart.defaultProps = {
  data: [],
  margin: {top: 10, right: 10, bottom: 10, left: 10},
  title: 'Untitled',
  width: 550,
  height: 400
};
