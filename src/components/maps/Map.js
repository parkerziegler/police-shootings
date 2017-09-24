import * as React from 'react'
import { connect } from 'react-redux';
import './Map.css';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from './State';
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
        this.generateProportionalSymbolLegend();
        break;
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
        return <State mapType={mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} key={i} />;

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
        return <State mapType={mapType} stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} radius={radius(feature.properties.numShootings)} feature={feature} key={i}/>;
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

    // locate the svg we will be appending our legend to
    let svgLegend = d3.select('.map.proportional').append('svg');

    // start by adding a title
    svgLegend.append("text")
    .attr("transform", "translate(825, 360)")
    .attr("font-size", "12px")
    .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
    .attr("y", 20)
    .text("Number Shootings");

    // set up a scale for the radii of the circles, using square roots
    // to ensure we are comparing circle propotionally (by area)
    let radius = d3.scaleSqrt()
      .domain([0, 372])
      .range([0, 80]);

    // some data to scale the size of the circles
    let circlesLegendData = [10, 50, 100];
    let width = 300;
    let height = 100;

    // add the a <g> element to hold the circles
    let circlesLegend = svgLegend.append("g")
        .attr("class", "legend-circles")
        .attr("transform", "translate(875, 475)")
        .selectAll("g")
        .data(circlesLegendData)
        .enter()
        .append("g");

    // append a circle for each entry in the circlesLegendData array
    circlesLegend.append("circle")
        .attr("cy", function(d){ return -radius(d); })
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "#B24739")
        .attr("stroke-width", "0.5");
        
    // finally, add some labels 
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

    const { maps, mapType } = this.props;

    // create a geographic path renderer for our topojson
    let geoPath = d3.geoPath();
    let data = topojson.feature(maps.geoData, maps.geoData.objects.states).features;

    // call the appropriate renderer based on the mapType prop
    const generatePaths = () => {
      switch (mapType) {
        case 'choropleth':
          let choropleth = this.generatePath(geoPath, data);
          return choropleth;
        case 'proportional':
          let proportional = this.generateCircle(geoPath, data);
          return proportional;
        default:
          return;
      }
    };

    let paths = generatePaths();

    return (
			<div className='map-container'>
	      <svg className={`map ${mapType}`}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600">
	          <g>
	            {paths}
              {/* if the mapType is proportional, add StateLabels to the circles */}
              {mapType === 'proportional' ? _.map(data, (feature, i) => {
                return <StateLabel feature={feature} stateAbbreviation={feature.properties.stateAbbreviation} key={i} />;
              }) : null}
	          </g>
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
  mapType: PropTypes.string.isRequired
};

// just use a simple stateless functional component to render the state labels
const StateLabel = (props) => {

  // get the centroid of the state
  let centroid = d3.geoPath().centroid(props.feature);

  // translate the labels to be centered in the circle
  let translate = "translate(" + (centroid[0] - 8) + ", " + (centroid[1] + 2) + ")";

  // return a state label
  return <text transform={translate} className='state-label'>{props.stateAbbreviation}</text>;
};

StateLabel.propTypes = {
  feature: PropTypes.object.isRequired,
  stateAbbreviation: PropTypes.string.isRequired
};
