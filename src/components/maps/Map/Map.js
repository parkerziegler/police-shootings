import * as React from 'react';
import { connect } from 'react-redux';
import { sortedIndex, sortBy, uniq, round, concat, orderBy } from 'lodash';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import { colors } from '../../../constants/colors';
import '../../../stylesheets/Map.css';
import State from '../State/State';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.generatePath = this.generatePath.bind(this);
    this.generateCircle = this.generateCircle.bind(this);
    this.generateChoroplethLegend = this.generateChoroplethLegend.bind(this);
    this.generateProportionalSymbolLegend = this.generateProportionalSymbolLegend.bind(
      this
    );
  }

  generatePath(geoPath, data) {
    const { mapType } = this.props;
    return (
      <TransitionGroup component={null}>
        {data.map((feature, i) => {
          // render an svg path using the geographic path generator
          const path = geoPath(feature);
          const shootingsPerCapita =
            feature.properties.numShootings /
            feature.properties.population *
            1000000;
          const breaks = this.getChoroplethBreaks();
          // find the color that corresponds to the break
          const fill = !shootingsPerCapita
            ? '#F3F7F6'
            : colors[sortedIndex(breaks, shootingsPerCapita) - 1];

          // return a state component
          return (
            <CSSTransition
              key={i}
              classNames={`state-transition-${i}`}
              appear
              timeout={5000}
            >
              <State
                mapType={mapType}
                stateName={feature.properties.stateName}
                numShootings={feature.properties.numShootings}
                population={feature.properties.population}
                path={path}
                feature={feature}
                i={i}
                fill={fill}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }

  getChoroplethBreaks() {
    const { maps } = this.props;

    // for choropleth, generate a set of rects to map over our
    // data and obtain the shootings per million of each
    const shootingsArray = sortBy(
      maps.geoData.objects.states.geometries.map(feature => {
        return (
          feature.properties.numShootings /
          feature.properties.population *
          1000000
        );
      })
    );

    // use quantiles to generate our choropleth breaks
    const quantiles = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95];
    let legendValues = uniq(
      quantiles.map(tick => round(d3.quantile(shootingsArray, tick)))
    );

    // if breaks don't include 0 as a value, prepend it
    if (legendValues[0] !== 0) {
      legendValues = concat([0], legendValues);
    }
    return legendValues;
  }

  generateCircle(geoPath, data) {
    const { maps, mapType } = this.props;

    // for circles, sort the data in descending order
    // this ensures that smaller circles will render last - on top of larger circles
    const statesByShootings = orderBy(
      maps.geoData.objects.states.geometries,
      ['properties.numShootings'],
      ['desc']
    );

    const maxState = d3.max(
      statesByShootings,
      feature => feature.properties.numShootings
    );

    // set up a scale for the radius, the max will be the max in the dataset
    const radius = d3
      .scaleSqrt()
      .domain([0, maxState])
      .range([0, 80]);

    // return svg paths
    return (
      <g>
        <TransitionGroup component={null}>
          {data.map((feature, i) => {
            const path = geoPath(feature);
            return (
              <CSSTransition
                key={i}
                classNames={`state-transition-${i}`}
                appear
                timeout={5000}
              >
                <State
                  mapType={mapType}
                  stateName={feature.properties.stateName}
                  numShootings={feature.properties.numShootings}
                  population={feature.properties.population}
                  path={path}
                  radius={radius(feature.properties.numShootings)}
                  feature={feature}
                  i={i}
                  fill={'#B24739'}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </g>
    );
  }

  generateChoroplethLegend() {
    const legendValues = this.getChoroplethBreaks();
    const legendRects = [];
    const legendTexts = [];
    legendValues.forEach((value, i) => {
      const rect = (
        <rect
          fill={colors[i]}
          x={i * 30}
          y={30}
          width={30}
          height={20}
          key={`rect-${i}`}
        />
      );

      const text = (
        <text
          fontSize="10px"
          fontFamily="HelveticaNeue-Light, Helvetica, sans-serif"
          x={i * 30}
          y={60}
          key={`text-${i}`}
        >
          {value}
        </text>
      );

      legendRects.push(rect);
      legendTexts.push(text);
    });

    return (
      <g transform="translate(500, 525)">
        <text
          fontSize="10px"
          fontFamily="HelveticaNeue-Bold, Helvetica, sans-serif"
          y={20}
        >
          Shootings Per Million
        </text>
        {legendRects}
        {legendTexts}
      </g>
    );
  }

  generateProportionalSymbolLegend() {
    const { maps } = this.props;
    const shootingsArray = orderBy(
      maps.geoData.objects.states.geometries,
      ['properties.numShootings'],
      ['desc']
    ).map(feature => feature.properties.numShootings);

    // also get the max number of shootings in the dataset
    // this will set up a d3 scale appropriate for the data
    const maxState = d3.max(shootingsArray);

    // we'll use d3 to generate quantiles for the legend
    const quantiles = [0.75, 0.5, 0.1];
    let legendValues = quantiles.map(tick =>
      round(d3.quantile(shootingsArray, tick), -1)
    );

    // check to see if all values are under 10
    // if so, just render a single circle
    const allUnder10 = legendValues.every(value => value < 10);
    if (allUnder10) {
      legendValues = [5];
    }

    // set up a scale for the radii of the circles, using square roots
    // to ensure circles are compared propotionally (by area)
    const radius = d3
      .scaleSqrt()
      .domain([0, maxState])
      .range([0, 80]);

    const legendComponents = legendValues.map((value, i) => {
      if (!value) {
        return [];
      }

      return (
        <g key={i}>
          <circle
            cy={-radius(value)}
            r={radius(value)}
            stroke="#B24739"
            strokeWidth="0.5"
            fill="none"
          />
          <text
            y={-2 * radius(value)}
            dy="1.3em"
            textAnchor="middle"
            fill="#666"
            className="legend-label"
          >
            {value}
          </text>
        </g>
      );
    });

    return (
      <g height="300" width="100" transform="translate(875, 475)">
        <text transform="translate(-55, 5)" className="legend-title" y="20">
          Number Shootings
        </text>
        {legendComponents}
      </g>
    );
  }

  render() {
    const { maps, mapType } = this.props;

    // create a geographic path renderer for our topojson
    const geoPath = d3.geoPath();
    const data = topojson.feature(maps.geoData, maps.geoData.objects.states)
      .features;
    const map =
      mapType === 'choropleth'
        ? this.generatePath(geoPath, data)
        : this.generateCircle(geoPath, data);
    const legend =
      mapType === 'choropleth'
        ? this.generateChoroplethLegend()
        : this.generateProportionalSymbolLegend();

    return (
      <div className="map-container">
        <svg
          className={`map ${mapType}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 960 600"
        >
          {map}
          {legend}
        </svg>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  maps: state.mapReducer,
  mapType: ownProps.mapType,
});

export default connect(mapStateToProps)(Map);

Map.propTypes = {
  maps: PropTypes.object.isRequired,
  mapType: PropTypes.string.isRequired,
};
