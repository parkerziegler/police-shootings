import * as React from 'react';
import { connect } from 'react-redux';
import './MapDescription.css';
import * as _ from 'lodash';
import DataTable from '../DataTable/DataTable';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

class MapDescription extends React.Component {
  render() {
    const { mapType, router, maps } = this.props;

    const children = () => {
      switch (mapType) {
        case 'choropleth':
          return {
            text: router.result.jsx,
            stat: (
              <div className="inset-subheader">
                {Number(maps.activeState.shootingsPerMillion).toFixed(2) +
                  ' shootings per million'}
              </div>
            ),
          };
        case 'proportional':
          return {
            text: router.result.jsx,
            stat: (
              <div className="inset-subheader">
                {maps.activeState.shootings + ' shootings'}
              </div>
            ),
          };
        default:
          return;
      }
    };

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          appear
          classNames="description-transition"
          timeout={5000}
        >
          <div className="map-description-container">
            <div className="inset-header">{router.result.descTitle}</div>
            <div className="inset-subheader">{router.result.descSubtitle}</div>
            {children().text}
            <div className="state-name">{maps.activeState.stateName}</div>
            {children().stat}
            <DataTable mapType={mapType} />
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
    insetHeader: ownProps.insetHeader,
    mapType: ownProps.mapType,
    router: state.router,
  };
};

export default connect(mapStateToProps)(MapDescription);

MapDescription.propTypes = {
  insetHeader: PropTypes.string.isRequired,
  mapType: PropTypes.string.isRequired,
};
