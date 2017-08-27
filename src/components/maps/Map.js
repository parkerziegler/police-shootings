import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from './State';
import Legend from './Legend';
import * as stateNames from '../../assets/state-names';
import axios from 'axios';
import * as actions from '../../actions/actions';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.generatePath = this.generatePath.bind(this);
    this.generateCircle = this.generateCircle.bind(this);
    this.generateChoroplethLegend = this.generateChoroplethLegend.bind(this);
    this.generateProportionalSymbolLegend = this.generateProportionalSymbolLegend.bind(this);
  }

	componentDidMount() {

		// define a new legend

    this.props.mapType === 'choropleth' ? this.generateChoroplethLegend() : this.generateProportionalSymbolLegend();

  }
  
  generatePath(geoPath, data) {

    const featurePath = () => {
      let pathComponent = _.map(data, (feature, i) => {
        let path = geoPath(feature);
        return <State mapType={this.props.mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} key={i} />;
      });
      return pathComponent;
    }

    let paths = featurePath();
    return paths;

  }

  generateCircle(geoPath, data) {

    // get the max num shootings of the dataset
    let statesByShootings = _.orderBy(this.props.maps.data.objects.states.geometries, ['properties.numShootings'], ['desc']);

    let maxState = statesByShootings[0].properties.numShootings;

    // set up a scale for the radius, the max will be the max in the dataset
    let radius = d3.scaleSqrt()
      .domain([0, 372])
      .range([0, 80]);

    const featurePath = () => {
      let pathComponent = _.map(data, (feature, i) => {
        let path = geoPath(feature);
        return <State mapType={this.props.mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} radius={radius(feature.properties.numShootings)} feature={feature} key={i}/>;
      });
      return pathComponent;
    }

    let paths = featurePath();
    return paths;

  }

  generateChoroplethLegend() {

    let svgLegend = d3.select('.map.choropleth').append('svg');

    // now create a legend. start by storing all color values in an array
    let colorLegend = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)"];
    
    svgLegend.append("g")
        .attr("transform", "translate(500, 525)")
        .selectAll("rect")
        .data(colorLegend)
        .enter()
        .append("rect")
        .attr("fill", function(d, i){ return colorLegend[i]; })
        .attr("x", function(d, i){ return (i*30); })
        .attr("y", 30)
        .attr("width", 30)
        .attr("height", 20);

    // add a legend title
    svgLegend.append("text")
      .attr("transform", "translate(500, 525)")
      .attr("font-size", "12px")
      .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
      .attr("y", 20)
      .text("Shootings Per Million");

    // add numbers to legend
    let labelsLegend = ["0-1","1-3","3-5","5-7","7-10","10-12","12-15",">15"];
    svgLegend.append("g")
      .attr("transform", "translate(500, 525)")
      .selectAll("text")
      .data(labelsLegend)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
      .attr("x", function(d, i){ return (i*30); })
      .attr("y", 60)
      .text(function(d){ return d; });

  }

  generateProportionalSymbolLegend() {

    let svgLegend = d3.select('.map.proportional').append('svg');

    svgLegend.append("text")
    .attr("transform", "translate(825, 360)")
    .attr("font-size", "12px")
    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
    .attr("y", 20)
    .text("Number Shootings");

    let radius = d3.scaleSqrt()
      .domain([0, 372])
      .range([0, 80]);

    let circlesLegendData = [10, 50, 100];
    let width = 300;
    let height = 100;

    let circlesLegend = svgLegend.append("g")
        .attr("class", "legend-circles")
        .attr("transform", "translate(875, 475)")
        .selectAll("g")
        .data(circlesLegendData)
        .enter()
        .append("g");

    circlesLegend.append("circle")
        .attr("cy", function(d){ return -radius(d); })
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "#B24739")
        .attr("stroke-width", "0.5");
        
    circlesLegend.append("text")
        .text(function(d){ return d; })
        .attr("y", function(d) { return -2 * radius(d); })
        .attr("dy", "1.3em")
        .attr("text-anchor", "middle")
        .attr("fill", "#666")
        .attr("font-size", "10px")
        .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif");
  }

  render() {

    // some important pieces for the render
    let geoPath = d3.geoPath();
    let data = topojson.feature(this.props.maps.data, this.props.maps.data.objects.states).features;

    let paths = this.props.mapType === 'choropleth' ?
        this.generatePath(geoPath, data) : this.generateCircle(geoPath, data);

    return (
			<div className='map-container'>
	      <svg className={`map ${this.props.mapType}`} width="960" height="600" viewBox="0 0 960 600">
	          <g>
	            {paths}
              {this.props.mapType === 'proportional' ? _.map(data, (feature, i) => {
                return <StateLabel feature={feature} stateAbbreviation={feature.properties.stateAbbreviation} key={i} />;
              }) : null}
	          </g>
	      </svg>
			</div>
    );
  }
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(Map);

// just use a simple stateless functional component for the state labels
const StateLabel = (props) => {

  let centroid = d3.geoPath().centroid(props.feature);

  let translate = "translate(" + (centroid[0] - 8) + ", " + (centroid[1] + 2) + ")";

  return <text className='state-label' transform={translate} className='state-label'>{props.stateAbbreviation}</text>;
};
