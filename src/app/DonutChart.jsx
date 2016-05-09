import React from 'react';
import d3 from 'd3';

require('./DonutChart.css');

export default class DonutChart extends React.Component {
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
        <svg className/>
      </div>
    );
  }
  createChart(props){ //run once after mounting

    //let {arc, backDonut, width, height, outerRadius, innerRadius, place, svgframe, mainchart, colors} = this;
    let τ = 2 * Math.PI;

    this.width = 600;
    this.height = 400;
    this.outerRadius = Math.min(this.width,this.height)/3;
    this.innerRadius = (this.outerRadius/3)*2;

    this.colors = d3.scale.category10();

    this.place = d3.select(this.refs.wrapper);
    this.svgframe = this.place.select('svg')
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+this.width +' '+this.height )
    .attr('preserveAspectRatio','xMinYMin')


    this.mainchart = this.svgframe.append("g")
    .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

    this.svgframe.append("rect")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("style", "fill:none;stroke-width:1;stroke:rgb(255,0,0)")

    this.arc = d3.svg.arc()
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius);

    this.backDonut = this.mainchart.append("path")
        .datum({endAngle: τ})
        .style("fill", "#ccc")
        .attr("d", d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius).startAngle(0));

    this.updateChart();

  }
  updateChart(){

    let {arc, mainchart, colors, props} = this;

    let dynamicColor;

    let pie = function(data){
      let total = data.reduce((t,it)=>t+it.value,0);
      let ordered = data.slice(0).sort((a,b)=>b.value-a.value);
      let list = [];
      let accu = 0;
      for(let i=0;i<ordered.length;i++){ //orders them intercalating high and low value
        let d = i%2==0?ordered[Math.floor(i/2)]:ordered[ordered.length-Math.floor(i/2)-1];
        let extra = 2*Math.PI*(d.value/total);
        list[i] = {data:d, startAngle: accu, endAngle:accu+extra, padAngle: 0, value: d.value};
        accu = accu+extra;
      }
      return list;
    }

    let update_slice = mainchart.selectAll(".pieslice").data(pie(props.data));
    let enter_slice = update_slice.enter().append("g").attr("class", "pieslice");
    let exit_slice = update_slice.exit().remove();

    enter_slice.append("path")
    .attr("class", "slice")
    .style("fill", (d, i)=>colors(i))
    .on('mouseover', function(data) {
      dynamicColor = this.style.fill;
        d3.select(this).classed("mouseover", true).style('fill',d3.rgb(dynamicColor).darker(0.5));
    })
    .on('mouseout', function (data) {
        d3.select(this).classed("mouseover", false).style('fill',dynamicColor);
    })
    .attr("d", arc)
    .each(function(d) {
      this._current = d; }); // store the initial values

    update_slice.select(".slice").transition().duration(500)
    .attrTween('d', function(d) {
      let intSA = d3.interpolate(this._current.startAngle, d.startAngle);
      let intEA = d3.interpolate(this._current.endAngle, d.endAngle);
       this._current = d;
       return function(t) {
           d.startAngle = intSA(t);
           d.endAngle = intEA(t);
         return arc(d);
       }
     });

  }
}

DonutChart.defaultProps = {
  data: [],
  margin: {top: 10, right: 10, bottom: 10, left: 10},
  title: 'Untitled'
};
