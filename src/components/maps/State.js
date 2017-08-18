import * as React from 'react'
import '../../App.css'
import * as actions from '../../actions/actions';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class State extends React.Component {

  constructor(props) {
    super(props);
		this.getStateColor = this.getStateColor.bind(this);
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    this.getJSX = this.getJSX.bind(this);
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

	onMouseEnterHandler(event) {

		let state = {
			stateName: this.props.stateName,
			shootingsPerMillion: this.props.numShootings / this.props.population * 1000000
		};

		this.props.dispatch(actions.getHoveredStateData(state));
  }
  
  getJSX() {

    let translate = d3.geoPath().centroid(this.props.feature) ? d3.geoPath().centroid(this.props.feature) : '0, 0';

    const data = () => {
        if (this.props.mapType === 'choropleth') {

        let fill = this.getStateColor(this.props.numShootings / this.props.population * 1000000);
        
        return <path className='states' d={this.props.path} fill={fill} stroke="#FFFFFF" strokeWidth={0.25} onMouseEnter={this.onMouseEnterHandler} />;
      } else {
        return <circle className='states raw' r={this.props.radius} fill={"#B24739"} stroke="#FFFFFF" strokeWidth={0.5} transform={"translate(" + translate + ")"} opacity={0.75}/>
      }
    };

    let elements = data();
    return elements;
  }

  render() {

    let JSX = this.getJSX();
    return JSX;
    
  }
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(State);
