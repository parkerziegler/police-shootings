import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Fragment, push } from 'redux-little-router';
import { findKey } from 'lodash';

import Home from './components/home/Home';
import Map from './components/maps/Map/Map';
import MapDescription from './components/maps/MapDescription/MapDescription';
import Chevron from './components/navigation/Chevron/Chevron';
import * as ChevronPaths from './constants/chevron-paths';
import Line from './components/graphs/Line/Line';
import LineDescription from './components/graphs/LineDescription/LineDescription';

import './App.scss';

export class App extends Component {
  constructor(props) {
    super(props);
    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
    this.getChevronVisibility = this.getChevronVisibility.bind(this);
    this.goToNextChild = this.goToNextChild.bind(this);
    this.goToPreviousChild = this.goToPreviousChild.bind(this);
  }

  goToNext() {
    const { router, dispatch } = this.props;
    const nextRoute = findKey(
      router.routes,
      (route) => route.index === router.result.index + 1
    );
    dispatch(push(nextRoute));
  }

  goToPrevious() {
    const { router, dispatch } = this.props;
    const prevRoute = findKey(
      router.routes,
      (route) => route.index === router.result.index - 1
    );
    dispatch(push(prevRoute));
  }

  goToNextChild() {
    const { router, dispatch } = this.props;
    const currentRoute = router.result;
    const nextRoute = findKey(router.routes, (route) => {
      if (currentRoute.hasChildren) {
        return (
          route.childIndex === 0 && route.parent.index === currentRoute.index
        );
      }
      return (
        route.childIndex === router.result.childIndex + 1 &&
        route.parent.index === currentRoute.parent.index
      );
    });
    dispatch(push(nextRoute));
  }

  goToPreviousChild() {
    const { router, dispatch } = this.props;
    const currentRoute = router.result;
    const prevRoute = findKey(router.routes, (route) => {
      if (!currentRoute.childIndex) {
        return route.index === currentRoute.parent.index;
      }
      return (
        route.childIndex === currentRoute.childIndex - 1 &&
        route.parent.index === currentRoute.parent.index
      );
    });
    dispatch(push(prevRoute));
  }

  getChevronVisibility(position) {
    const { router } = this.props;
    const currentRoute = router.result;
    switch (position) {
      case 'right':
        if (!currentRoute.isLastRoute && !currentRoute.parent) {
          return true;
        }
        return false;
      case 'left':
        if (currentRoute.index) {
          return true;
        }
        return false;
      case 'down':
        if (currentRoute.hasChildren || currentRoute.hasNextSibling) {
          return true;
        }
        return false;
      case 'up':
        if (currentRoute.parent) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  render() {
    const { maps } = this.props;

    if (maps.fetchingData) {
      return null;
    }

    return (
      <Fragment forRoute={'/'}>
        <>
          <Chevron
            direction="up"
            path={ChevronPaths.ChevronUp}
            visible={this.getChevronVisibility('up')}
            onClick={this.goToPreviousChild}
          />
          <div className="page-container">
            <Chevron
              direction="left"
              path={ChevronPaths.ChevronLeft}
              onClick={this.goToPrevious}
              visible={this.getChevronVisibility('left')}
            />
            <div className="page-content">
              <Fragment forRoute={'/'}>
                <Home />
              </Fragment>
              <Fragment forRoute={'/total-shootings'}>
                <div className="map-layout">
                  <Map mapType="proportional" />
                  <MapDescription mapType="proportional" />
                </div>
              </Fragment>
              <Fragment forRoute={'/percapita'}>
                <div className="map-layout">
                  <Map mapType="choropleth" />
                  <MapDescription mapType="choropleth" />
                </div>
              </Fragment>
              <Fragment forRoute={'/shootingsbydate'}>
                <div className="chart-layout">
                  <LineDescription />
                  <Line />
                </div>
              </Fragment>
            </div>
            <Chevron
              direction="right"
              path={ChevronPaths.ChevronRight}
              onClick={this.goToNext}
              visible={this.getChevronVisibility('right')}
            />
          </div>
          <Chevron
            direction="down"
            path={ChevronPaths.ChevronDown}
            visible={this.getChevronVisibility('down')}
            onClick={this.goToNextChild}
          />
        </>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  maps: state.mapReducer,
  router: state.router,
});

export default connect(mapStateToProps)(App);

App.propTypes = {
  maps: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};
