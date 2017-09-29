import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Map from './components/maps/Map';
import MapDescription from './components/maps/MapDescription';
import BarChart from './components/graphs/BarChart';
import { callAPI } from './actions/actions';
import PropTypes from 'prop-types';
import { Link, Fragment } from 'redux-little-router';
import * as _ from 'lodash';

class App extends Component {

  componentWillMount() {

    // on componentWillMount, invoke our callAPI saga to get our data
    const { dispatch } = this.props;

    dispatch(callAPI());
  }

  render() {

    // check if we're fetching data - if so, render a spinner
    // else, render our UI
    const { maps, router } = this.props;

    // get the next and previous route based on the current route
    let currentRouteIndex = router.result.index;

    let previousRouteIndex = router.routes[router.route].index - 1;

    // add a check to see if we're on the initial route
    let previousRoute = previousRouteIndex === -1 ? "/intro" : _.findKey(router.routes, (route) => {

      return route.index === previousRouteIndex;
    });

    // also add a check to see if we're on the last route
    let routerLength = _.keys(router.routes).length;

    let nextRouteIndex = router.routes[router.route].index + 1;

    let nextRoute = nextRouteIndex >= routerLength ? "/percapita" : _.findKey(router.routes, (route) => {

      return route.index === nextRouteIndex;
    });

    // TODO - implement a Spinner solution
    let component = maps.fetchingData ?
      <div></div> :
      <Fragment forRoute={process.env.PUBLIC_URL + '/'}>
      <div className='page-container'>
        <Link href={previousRoute} className='chevron-link' >
          <div className='chevron'>
            {currentRouteIndex > 0 ?
            <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path fill="#6C7680" d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"/>
            </svg> : null}
          </div>
        </Link>
          <Fragment forRoute={process.env.PUBLIC_URL + '/intro'}>
            <Home />
          </Fragment>
          <Fragment forRoute={process.env.PUBLIC_URL + '/total-shootings'}>
            <div className='raw'>
              <Map mapType='proportional' />
              <MapDescription mapType='proportional' insetHeader='Total Shootings'/>
            </div>
          </Fragment>
          <Fragment forRoute={process.env.PUBLIC_URL + '/percapita'}>
            <div className='percapita'>
              <Map mapType='choropleth' />
              <MapDescription mapType='choropleth' insetHeader='Shootings per Million' />
            </div>
          </Fragment>
          <Fragment forRoute={process.env.PUBLIC_URL + '/shootingsbydate'}>
              <BarChart />
          </Fragment>
        <Link href={nextRoute} className='chevron-link'>
          <div className='chevron'>
            {currentRouteIndex < (routerLength - 1) ?
            <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path fill="#6C7680" d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"/>
            </svg> : null}
          </div>
        </Link>
      </div>
      </Fragment>;

    return component;
  }
}

const mapStateToProps = (state) => {
  return {
    maps: state.mapReducer,
    router: state.router
  };
};

export default connect(mapStateToProps)(App);

// define propTypes for App
// App.propTypes = {
//   maps: PropTypes.shape({
//     fetchingData: PropTypes.bool.isRequired,
//     geoData: PropTypes.arrayOf(PropTypes.object).isRequired,
//     shootingsData: PropTypes.arrayOf(PropTypes.object).isRequired,
//     activeState: PropTypes.objectOf({
//       stateName: PropTypes.string.isRequired,
//       numberShootings: PropTypes.number.isRequired,
//       shootingsPerMillion: PropTypes.number.isRequired
//     }).isRequired
//   }).isRequired
// }

