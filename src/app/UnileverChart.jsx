import React from 'react';
import d3 from 'd3';

require('./UnileverStyles.css');

export default class UnileverChart extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    this.updateChart();
  }
  shouldComponentUpdate(nextProps) {
    this.updateChart();
    return false;
  }
  render () {
    //this is just run once when mounting for first time
    return (
      <article id="chart" style={{height: this.props.height, width: this.props.width}}>
        <div id="left-percentage" style={{width: 50, float:'left', display:'inline-box'}}/>
        <div id="headers" style={{width: 500, float:'left', display:'inline-box'}}/>
        <div id="main"/>
        <div id="right-percentage"/>
      </article>
    );
  }
  updateChart(){
    //this should be called everytime something in the chart has to change
    console.log('updating');
    this.updateLeftPercentage();
    this.updateHeaders();
  }
  updateHeaders(){
    const width = 100;
    const whenupdate = d3.select('#headers').selectAll('div').data(this.props.data);
    const whenenter = whenupdate.enter();

    const div = whenenter.append('div').style('width', width);

    div.append("div").attr('background-color', (d,i)=>gcolors(i));
    div.append("h3").text((d)=>d.name);
  }
  updateLeftPercentage(){
    const height = this.props.height;
    const scale_height = 300;
    const scale_y = (height-scale_height-20);
    const width = 46;
    const chunk_width = 2;
    const chunk_x = width-chunk_width;
    const high = this.props.scale.high;
    const low = this.props.scale.low;
    const svg = d3.select('#left-percentage').append('svg').attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform',"translate(0, "+ scale_y +")");

    const colors = ['#55B94E','#FF9D00','#DD5C5C'];
    const start_y = 0;
    const end_y = scale_height;
    const spacing = 1;
    const total_size = end_y-start_y;
    const chunk_number = 8;
    const chunk_size = (total_size-spacing*(chunk_number-1))/chunk_number;
    let data = [];
    for(let i=0;i<chunk_number;i++){
      let start_pos = start_y+(chunk_size+spacing)*i;
      let end_pos = start_pos+chunk_size;
        if(1-(end_pos-start_y)/total_size >= high/100 ){
            data.push({fill: colors[0], x:chunk_x, y:start_pos, width:chunk_width, height:chunk_size});
        }else if(1-(start_pos-start_y)/total_size >= high/100 ){
            data.push({fill: colors[0], x:chunk_x, y:start_pos, width:chunk_width, height:chunk_size});
            const other_y = start_y+total_size*(1-high/100);
            data.push({fill: colors[1], x:chunk_x, y:other_y, width:chunk_width, height:end_pos-other_y});
        }else if(1-(end_pos-start_y)/total_size >= low/100 ){
            data.push({fill: colors[1], x:chunk_x, y:start_pos, width:chunk_width, height:chunk_size});
        }else if(1-(start_pos-start_y)/total_size >= low/100 ){
            data.push({fill: colors[1], x:chunk_x, y:start_pos, width:chunk_width, height:chunk_size});
            const other_y = start_y+total_size*(1-low/100);
            data.push({fill: colors[2], x:chunk_x, y:other_y, width:chunk_width, height:end_pos-other_y});
        }else {
            data.push({fill: colors[2], x:chunk_x, y:start_pos, width:chunk_width, height:chunk_size});
        }
    }

    const percentages = g.append("g").attr('transform',"translate("+ (width-10) +", 0)").attr('id', 'percentages');
    ['100%','75%','50%','25%','0%'].forEach((perc,i)=>{
      percentages.append('text').attr('text-anchor','end').attr('y', scale_height/4*i).text(perc);
    });

    const whenupdate = g.selectAll('rect').data(data);

    const whenenter = whenupdate.enter();

    whenenter.append('rect').attr('fill',d=>d.fill).attr('x',d=>d.x).attr('y',d=>d.y).attr('width',d=>d.width).attr('height',d=>d.height);

  }
}

UnileverChart.propTypes = {
  // width: React.PropTypes.number,
  // height: React.PropTypes.number,
  // title: React.PropTypes.string,
};
UnileverChart.defaultProps = {
  width: 980,
  height: 380,
  scale: {high: 70, low: 30}
};


function gcolors(n) {
  var colors_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colors_g[n % colors_g.length];
}
