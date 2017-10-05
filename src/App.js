import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Map from './components/maps/Map';
import MapDescription from './components/maps/MapDescription';
import BarChart from './components/graphs/BarChart';
import Chevron from './components/navigation/components/Chevron';
import { callAPI } from './actions/actions';
import PropTypes from 'prop-types';
import { Link, Fragment } from 'redux-little-router';
import * as _ from 'lodash';

class App extends Component {

  constructor() {
    super();
    this.findKey = this.findKey.bind(this);
    this.getMainRoutes = this.getMainRoutes.bind(this);
    this.getChildRoutes = this.getChildRoutes.bind(this);
  }

  componentWillMount() {

    // on componentWillMount, invoke our callAPI saga to get our data
    const { dispatch } = this.props;
    dispatch(callAPI());
  }

  findKey(index) {

    // destructure props
    const { router } = this.props;

    // this is just a utility method to find the route index
    // that matches the one we passed in
    return _.findKey(router.routes, (route) => {
      return route.index === index;
    });
  }

  getMainRoutes() {

    // destructure props
    const { router } = this.props;

    let previousMainRoute;
    let nextMainRoute;

    // here we'll need to determine next and previous routes to pass
    // to our Chevron components
    let currentRoute = router.result; // router.routes[router.route];

    if (currentRoute.parent) {

      // this is a child route and has no main routes
      // just return '/'
      previousMainRoute = '/';
      nextMainRoute = '/';
    } else {

      // this is a main nav route
      // determine the previous and next routes

      // get the index of the previous main route
      let previousRouteIndex = currentRoute.index - 1;
    
      // add a check to see if we're on the initial route
      previousMainRoute = previousRouteIndex === -1 ? '/' : this.findKey(previousRouteIndex);

      // get the index of the next main route
      let nextRouteIndex = currentRoute.index + 1;

      // add a check to see if this is the last route
      nextMainRoute = currentRoute.isLastRoute ? '/' : this.findKey(nextRouteIndex);
    }

    return {
      previousMainRoute,
      nextMainRoute
    };

  }

  getChildRoutes() {

    const { router } = this.props;

    // here we need to determine previous and next routes
    // for the child navigation (i.e. within a map type)
    let currentRoute = router.result;

    let nextChildRoute;
    let previousChildRoute;

    if (currentRoute.hasChildren) {

      nextChildRoute = _.findKey(router.routes, (route) => {

        if (!route.parent) {
          return '/';
        }

        return route.parent.title === currentRoute.title && route.childIndex === 0;
      });

      previousChildRoute = '/';

    } else if (currentRoute.hasNextSibling) {

      let currentChildRouteIndex = currentRoute.childIndex;

      nextChildRoute = _.findKey(router.routes, (route) => {

        return route.childIndex === currentChildRouteIndex + 1;
      });

      previousChildRoute = currentChildRouteIndex === 0 ? currentRoute.parent.route : _.findKey(router.routes, (route) => {
        return route.childIndex === currentChildRouteIndex - 1;
      });

    } else if (currentRoute.isLastChildRoute) {

      let currentChildRouteIndex = currentRoute.childIndex;
      
      nextChildRoute = '/';

      previousChildRoute = currentChildRouteIndex === 0 ? currentRoute.parent.route : _.findKey(router.routes, (route) => {
        return route.childIndex === currentChildRouteIndex - 1;
      });

    } else {

      nextChildRoute = '/';
      previousChildRoute = '/';
    }

    return {
      previousChildRoute,
      nextChildRoute
    };

  }

  render() {

    // destructure props
    const { maps, router } = this.props;

    // obtain routes from getRoutes method
    let { previousMainRoute, nextMainRoute } = this.getMainRoutes();
    let { previousChildRoute, nextChildRoute } = this.getChildRoutes();

    // TODO - implement a Spinner solution
    let component = maps.fetchingData ?
      <div></div> :
      <Fragment forRoute={'/'}>
        <div className='layout'>
          <Chevron className='chevron-link vertical' path="M1683 1331l-166 165q-19 19-45 19t-45-19l-531-531-531 531q-19 19-45 19t-45-19l-166-165q-19-19-19-45.5t19-45.5l742-741q19-19 45-19t45 19l742 741q19 19 19 45.5t-19 45.5z" href={previousChildRoute} visible={previousChildRoute !== '/'} />
          <div className='page-container'>
            <Chevron className='chevron-link horizontal' path="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" href={previousMainRoute} visible={previousMainRoute !== '/' || router.route === '/total-shootings'} />
            <Fragment forRoute={'/'}>
              <Home />
            </Fragment>
            <Fragment forRoute={'/total-shootings'}>
              <div className='raw'>
                <Map mapType='proportional' />
                <MapDescription mapType='proportional' insetHeader='Total Shootings'/>
              </div>
            </Fragment>
            <Fragment forRoute={'/total-shootings/black'}></Fragment>
            <Fragment forRoute={'/total-shootings/latino'}></Fragment>
            <Fragment forRoute={'/total-shootings/asian'}></Fragment>
            <Fragment forRoute={'/total-shootings/nativeamerican'}></Fragment>
            <Fragment forRoute={'/total-shootings/white'}></Fragment>
            <Fragment forRoute={'/percapita'}>
              <div className='percapita'>
                <Map mapType='choropleth' />
                <MapDescription mapType='choropleth' insetHeader='Shootings per Million' />
              </div>
            </Fragment>
            <Fragment forRoute={'/shootingsbydate'}>
                <BarChart />
            </Fragment>
            <Chevron className='chevron-link horizontal' path="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" href={nextMainRoute} visible={nextMainRoute !== '/'} />
          </div>
          <Chevron className='chevron-link vertical' path="M1683 808l-742 741q-19 19-45 19t-45-19l-742-741q-19-19-19-45.5t19-45.5l166-165q19-19 45-19t45 19l531 531 531-531q19-19 45-19t45 19l166 165q19 19 19 45.5t-19 45.5z" href={nextChildRoute} visible={nextChildRoute !== '/'} />
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

// chevron down icon
{/* <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 808l-742 741q-19 19-45 19t-45-19l-742-741q-19-19-19-45.5t19-45.5l166-165q19-19 45-19t45 19l531 531 531-531q19-19 45-19t45 19l166 165q19 19 19 45.5t-19 45.5z"/></svg> */}

