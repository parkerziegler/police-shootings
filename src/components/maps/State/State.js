import * as React from 'react';
import { connect } from 'react-redux';
import { geoPath } from 'd3';
import PropTypes from 'prop-types';

import { getHoveredStateData } from '../../../actions/mapActions';

class State extends React.Component {
  constructor(props) {
    super(props);
    this.onInteractionHandler = this.onInteractionHandler.bind(this);
  }

  onInteractionHandler() {
    const { stateName, numShootings, population, dispatch } = this.props;
    // when a user hovers or clicks on a state, dispatch an action to set this state
    // as the activeState in the mapsReducer
    const state = {
      stateName,
      shootings: numShootings,
      shootingsPerMillion: (numShootings / population) * 1000000,
    };
    dispatch(getHoveredStateData(state));
  }

  render() {
    const { mapType, feature, path, radius, fill, i } = this.props;
    if (mapType === 'choropleth') {
      return (
        <path
          className={`states state-transition-${i}`}
          d={path}
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth={0.25}
          onMouseEnter={this.onInteractionHandler}
          onClick={this.onInteractionHandler}
          onTouchStart={this.onInteractionHandler}
        />
      );
    }

    if (mapType === 'proportional') {
      // get the centroid of the state and translate the labels to be centered
      const centroid = geoPath().centroid(feature);
      const translate =
        'translate(' + (centroid[0] - 8) + ', ' + (centroid[1] + 2) + ')';

      return (
        <g className="state-container">
          <circle
            className={`states raw state-transition-${i}`}
            r={radius}
            fill={fill}
            stroke="#FFFFFF"
            strokeWidth={0.5}
            transform={'translate(' + centroid + ')'}
            opacity={0.75}
            onMouseEnter={this.onInteractionHandler}
            onClick={this.onInteractionHandler}
            onTouchStart={this.onInteractionHandler}
          />
          <text
            transform={translate}
            className="state-label"
            onMouseEnter={this.onInteractionHandler}
            onClick={this.onInteractionHandler}
            onTouchStart={this.onInteractionHandler}
          >
            {feature.properties.stateAbbreviation}
          </text>
        </g>
      );
    }
    return null;
  }
}

export default connect()(State);

State.propTypes = {
  mapType: PropTypes.string.isRequired,
  stateName: PropTypes.string.isRequired,
  numShootings: PropTypes.number.isRequired,
  population: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  radius: PropTypes.number,
};
