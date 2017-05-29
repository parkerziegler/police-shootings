import * as React from 'react'
import '../../App.css'

class State extends React.Component {

  constructor(props) {
    super(props);
		this.getStateColor = this.getStateColor.bind(this);
  }

	getStateColor(shootingsPerCapita) {

		if (shootingsPerCapita < 1){
        return "rgb(247,251,255)";
      }
      else if (shootingsPerCapita < 3){
        return "rgb(222,235,247)";
      }
      else if (shootingsPerCapita < 5){
        return "rgb(198,219,239)";
      }
      else if (shootingsPerCapita < 7){
        return "rgb(158,202,225)";
      }
      else if (shootingsPerCapita < 10){
        return "rgb(107,174,214)";
      }
      else if (shootingsPerCapita < 12){
        return "rgb(66,146,198)";
      }
      else if (shootingsPerCapita < 15){
        return "rgb(33,113,181)";
      }
      else {
        return "rgb(8,81,156)";
      }
	}

  render() {

		let fill = this.getStateColor(this.props.numShootings / this.props.population * 1000000);
    return <path className='states' d={this.props.path} fill={fill} />;
  }
}

export default State;