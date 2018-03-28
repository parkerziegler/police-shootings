import React, { Component } from "react";
import { connect } from "react-redux";

import "./App.css";
import Home from "./components/home/Home";
import Map from "./components/maps/Map/Map";
import MapDescription from "./components/maps/MapDescription/MapDescription";
import BarChart from "./components/graphs/BarChart/BarChart";
import ChartDescription from "./components/graphs/ChartDescription/ChartDescription";
import Chevron from "./components/navigation/Chevron/Chevron";
import PropTypes from "prop-types";
import { Fragment, go, goBack, push } from "redux-little-router";
import { findKey } from "lodash";
import Filters from "./components/graphs/Filters/Filters";
import * as actions from "./actions/mapActions";
import * as ChevronPaths from "./constants/chevron-paths";

class App extends Component {
  constructor(props) {
    super(props);
    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
  }

  goToNext() {
    const { router, dispatch } = this.props;
    const nextRoute = findKey(
      router.routes,
      route => route.index === router.result.index + 1
    );
    this.props.dispatch(push(nextRoute));
  }

  goToPrevious() {
    this.props.dispatch(goBack());
  }

  render() {
    const { maps } = this.props;
    return maps.fetchingData ? (
      <div />
    ) : (
      <Fragment forRoute={"/"}>
        <React.Fragment>
          <Chevron className="chevron-link top" path={ChevronPaths.ChevronUp} />
          <div className="page-container">
            <Chevron
              className="chevron-link horizontal"
              path={ChevronPaths.ChevronRight}
              onClick={this.goToPrevious}
            />
            <div className="page-content">
              <Fragment forRoute={"/"}>
                <Home />
              </Fragment>
              <Fragment forRoute={"/total-shootings"}>
                <div className="map-layout">
                  <Map mapType="proportional" />
                  <MapDescription
                    mapType="proportional"
                    insetHeader="Total Shootings"
                  />
                </div>
              </Fragment>
              <Fragment forRoute={"/percapita"}>
                <div className="map-layout">
                  <Map mapType="choropleth" />
                  <MapDescription
                    mapType="choropleth"
                    insetHeader="Shootings per Million"
                  />
                </div>
              </Fragment>
            </div>
            <Chevron
              className="chevron-link horizontal"
              path={ChevronPaths.ChevronLeft}
              onClick={this.goToNext}
            />
          </div>
          <Chevron
            className="chevron-link bottom"
            path={ChevronPaths.ChevronDown}
          />
        </React.Fragment>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  maps: state.mapReducer,
  router: state.router
});

export default connect(mapStateToProps)(App);

App.propTypes = {
  maps: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};
