import * as React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import '../../../stylesheets/MapDescription.css';
import DataTable from '../DataTable/DataTable';

class MapDescription extends React.Component {
  render() {
    const { mapType, router, maps } = this.props;
    const stat =
      mapType === 'choropleth'
        ? `${maps.activeState.shootingsPerMillion.toFixed(
            2
          )} shootings per million`
        : `${maps.activeState.shootings} shootings`;

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
            {router.result.jsx}
            <div className="state-name">{maps.activeState.stateName}</div>
            <div className="inset-subheader">{stat}</div>
            <DataTable mapType={mapType} />
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  maps: state.mapReducer,
  mapType: ownProps.mapType,
  router: state.router,
});

export default connect(mapStateToProps)(MapDescription);

MapDescription.propTypes = {
  mapType: PropTypes.string.isRequired,
};
