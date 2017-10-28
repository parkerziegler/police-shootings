import * as React from 'react'
import { connect } from 'react-redux';
import './Map.css';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from '../State/State';
import PropTypes from 'prop-types';

const colors = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)"];

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.generatePath = this.generatePath.bind(this);
    this.generateCircle = this.generateCircle.bind(this);
    this.generateChoroplethLegend = this.generateChoroplethLegend.bind(this);
    this.generateProportionalSymbolLegend = this.generateProportionalSymbolLegend.bind(this);
  }
  
  generatePath(geoPath, data) {

    const { mapType } = this.props;

    // iterate over the topojson data
    let pathComponent = _.map(data, (feature, i) => {

      // render an svg path using the geographic path generator
      let path = geoPath(feature);

      let shootingsPerCapita = feature.properties.numShootings / feature.properties.population * 1000000;

      let breaks = this.getChoroplethBreaks();

      let fill = shootingsPerCapita === 0 ? '#F3F7F6' : colors[_.sortedIndex(breaks, shootingsPerCapita) - 1];

      // return a state component
      return <State mapType={mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} feature={feature} i={i} key={i} fill={fill} />;

    });
    
    // return all of the paths
    return pathComponent;

  }

  getChoroplethBreaks() {

    const { maps } = this.props;

    // for choropleth, we'll want to generate a set of rects
    // map over our data obtain the shootings per million of each
    let shootingsArray = _.sortBy(_.map(maps.geoData.objects.states.geometries, (feature) => {
      return feature.properties.numShootings / feature.properties.population * 1000000;
    }), (tick) => {
      return tick;
    });

    // we'll use quantiles to generate our choropleth breaks
    let quantiles = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95];

    let legendValues = _.uniq(_.map(quantiles, (tick) => {
      return _.round(d3.quantile(shootingsArray, tick));
    }));

    if (legendValues[0] !== 0) {
      legendValues = _.concat([0], legendValues)
    }

    return legendValues;
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

    // return our svg paths
    let pathComponent = _.map(data, (feature, i) => {

      let path = geoPath(feature);
      
      return <State mapType={mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} radius={radius(feature.properties.numShootings)} feature={feature} i={i} fill={"#B24739"} key={i}/>;
    });

    return pathComponent;

  }

  generateChoroplethLegend() {

    let legendValues = this.getChoroplethBreaks();

    let legendRects = [];
    let legendTexts = [];

    legendValues.forEach((value, i) => {
      
      let rect = <rect fill={colors[i]} x={i * 30} y={30} width={30} height={20} key={`rect-${i}`}/>;

      let text = <text fontSize="10px" fontFamily="HelveticaNeue-Light, Helvetica, sans-serif" x={i * 30} y={60} key={`text-${i}`}>{value}</text>;

      legendRects.push(rect);
      legendTexts.push(text);
    });
    
    return (
      <g transform="translate(500, 525)">
        {legendRects}
        {legendTexts}
      </g>
    );

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
      let legend;

      switch (mapType) {
        case 'choropleth':
          map = this.generatePath(geoPath, data);
          legend = this.generateChoroplethLegend();
          return {
            map,
            legend
          };
        case 'proportional':
          map = this.generateCircle(geoPath, data);
          legend = this.generateProportionalSymbolLegend();
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
