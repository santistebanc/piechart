import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './BarChart.jsx';
import PieChart from './PieChart.jsx';
import DonutChart from './DonutChart.jsx';

let mydata = [{name: "Germany", value: 80.62},
             {name: "France", value: 66.03},
             {name: "USA", value: 318.9},
             {name: "Serbia", value: 7.164},
             {name: "India", value: 1252},
             {name: "Mexico", value: 122.3}];

let groups = [{name: "Authenticity", categories: [{name: "Meaningful", value:89},{name: "Meaningful", value:89},{name: "Different", value:86},{name: "Parent Branding", value:56},{name: "Variant Branding", value:44}]},
              {name: "Relevance", categories: [{name: "Relevance", value:75},{name: "Persuasion", value:45},{name: "Main Point", value:34}]},
              {name: "Talkability", categories: [{name: "Enjoyment", value:78},{name: "Active Involvement", value:36},{name: "Expressiveness", value:0}]},
             ];


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {datastate: mydata}
  }
  handleClick(){
    this.state.datastate.forEach((item,i)=>{
      item.value = Math.round(Math.random()*1000);
    });
    this.setState({datastate: this.state.datastate});
    this.setState({title: "Population"});
    this.forceUpdate();
  }
  render () {
    return (<div>
      <p> D3 Charts!</p>
      <div>
      <div style={{width: '80%', height: 500, display:'inline-box', float:'left'}}><DonutChart title={this.state.title} data={this.state.datastate}/></div>
      </div>
      <button onClick={this.handleClick.bind(this)}>change data</button>
    </div>);
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
