import * as React from 'react'
import { connect } from 'react-redux';
import './Map.css';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from '../State/State';
import PropTypes from 'prop-types';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.generatePath = this.generatePath.bind(this);
    this.generateCircle = this.generateCircle.bind(this);
    this.generateChoroplethLegend = this.generateChoroplethLegend.bind(this);
    this.generateProportionalSymbolLegend = this.generateProportionalSymbolLegend.bind(this);
  }

	componentDidMount() {

    // define a new legend - we'll let D3 really take the reins here
    const { mapType } = this.props;

    // switch on the mapType prop to determine which legend to render
    switch (mapType) {
      case 'choropleth':
        this.generateChoroplethLegend();
        break;
      case 'proportional':
        return;
      default:
        return;
    }

  }
  
  generatePath(geoPath, data) {

    const { mapType } = this.props;

    // iterate over the topojson data
    const featurePath = () => {
      let pathComponent = _.map(data, (feature, i) => {

        // render an svg path using the geographic path generator
        let path = geoPath(feature);

        // return a state component
        return <State mapType={mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} feature={feature} i={i} key={i} />;

      });
      
      // return all of the paths
      return pathComponent;
    }

    // invoke the function and return the components
    let paths = featurePath();
    return paths;

  }

  generateCircle(geoPath, data) {

    const { maps, mapType } = this.props;

    // for circles, we need to sort the data in descending order
    // this ensures that smaller circles will render last - on top of larger circles
    let statesByShootings = _.orderBy(maps.geoData.objects.states.geometries, ['properties.numShootings'], ['desc']);

    // also get the max number of shootings in the dataset - this will
    // help us set up a d3 scale appropriate for the data
    let maxState = statesByShootings[0].properties.numShootings;

    // set up a scale for the radius, the max will be the max in the dataset
    let radius = d3.scaleSqrt()
      .domain([0, maxState])
      .range([0, 80]);

    // define a similar function to the one in this.generatePath - this actually
    // returns our svg paths
    const featurePath = () => {
      let pathComponent = _.map(data, (feature, i) => {
        let path = geoPath(feature);
        return <State mapType={mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} radius={radius(feature.properties.numShootings)} feature={feature} i={i} key={i}/>;
      });
      return pathComponent;
    }

    let paths = featurePath();
    return paths;

  }

  generateChoroplethLegend() {

    // locate the svg that we'll render our legend into
    let svgLegend = d3.select('.map.choropleth').append('svg');

    // now create a legend
    // start by storing all color values in an array
    let colorLegend = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)"];
    
    // append the rectangles we'll use for our choropleth
    // assign the color based on their index in colorLegend
    svgLegend.append("g")
        .attr("transform", "translate(500, 525)")
        .selectAll("rect")
        .data(colorLegend)
        .enter()
        .append("rect")
        .attr("fill", function(d, i){ return colorLegend[i]; })
        .attr("x", function(d, i){ return (i * 30); })
        .attr("y", 30)
        .attr("width", 30)
        .attr("height", 20);

    // add a title to the legend
    svgLegend.append("text")
      .attr("transform", "translate(500, 525)")
      .attr("font-size", "12px")
      .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
      .attr("y", 20)
      .text("Shootings Per Million");

    // add labels to the legend
    let labelsLegend = ["0-1", "1-3", "3-5", "5-7", "7-10", "10-12", "12-15", ">15"];
    svgLegend.append("g")
      .attr("transform", "translate(500, 525)")
      .selectAll("text")
      .data(labelsLegend)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
      .attr("x", function(d, i) { return (i * 30); })
      .attr("y", 60)
      .text(function(d) { return d; });

  }

  generateProportionalSymbolLegend() {

    const { maps } = this.props;

    // for circles, we need to sort the data in descending order
    // this ensures that smaller circles will render last - on top of larger circles
    let shootingsArray = _.map(_.orderBy(maps.geoData.objects.states.geometries, ['properties.numShootings'], ['desc']), (feature) => {
      return feature.properties.numShootings;
    });
    
    // also get the max number of shootings in the dataset - this will
    // help us set up a d3 scale appropriate for the data
    let maxState = d3.max(shootingsArray);

    // we'll use d3 to generate quantiles for the legend
    let quantiles = [0.75, 0.5, 0.1];

    let legendValues = _.map(quantiles, (tick) => {
      return _.round(d3.quantile(shootingsArray, tick), -1);
    });

    // check to see if all values are under 10
    let allUnder10 = _.every(legendValues, (value) => {
      return value < 10
    });

    // if so, just render a single circle
    if (allUnder10) {
      legendValues = [5];
    }

    // set up a scale for the radii of the circles, using square roots
    // to ensure we are comparing circle propotionally (by area)
    let radius = d3.scaleSqrt()
      .domain([0, maxState])
      .range([0, 80]);
      
    let legendCircles = legendValues.map((value, i) => {
      return <circle cy={-radius(value)} r={radius(value)} stroke="#B24739" strokeWidth="0.5" fill="none" key={i}/>;
    });

    let legendLabels = legendValues.map((value, i) => {

      if (value === 0) {
        return [];
      }

      return <text y={-2 * radius(value)} dy="1.3em" textAnchor="middle" fill="#666" className="legend-label" key={i}>{value}</text>
    });

    return (
      <g height="300" width="100" transform="translate(875, 475)">
        <text transform="translate(-55, 5)" className='legend-title' y="20">Number Shootings</text>
        <g>
          {legendCircles}
          {legendLabels}
        </g>
      </g>
    );
  }

  render() {

    const { maps, mapType } = this.props;

    // create a geographic path renderer for our topojson
    let geoPath = d3.geoPath();
    let data = topojson.feature(maps.geoData, maps.geoData.objects.states).features;

    // call the appropriate renderer based on the mapType prop
    const generatePaths = () => {

      let map;
      switch (mapType) {
        case 'choropleth':
          map = this.generatePath(geoPath, data);
          return {
            map
          };
        case 'proportional':
          map = this.generateCircle(geoPath, data);
          let legend = this.generateProportionalSymbolLegend();
          return {
            map,
            legend
          };
        default:
          return;
      }
    };

    let paths = generatePaths();

    return (
			<div className='map-container'>
	      <svg className={`map ${mapType}`}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600">
	          <g>
	            {paths.map}
	          </g>
            {paths.legend}
	      </svg>
			</div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
    mapType: ownProps.mapType
  };
};

export default connect(mapStateToProps)(Map);

Map.propTypes = {
  maps: PropTypes.object.isRequired,
  mapType: PropTypes.string.isRequired
};
