import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Map from './components/maps/Map';
import MapDescription from './components/maps/MapDescription';
import { callAPI } from './actions/actions';
import PropTypes from 'prop-types';
import { Link, Fragment } from 'redux-little-router';

class App extends Component {

  componentWillMount() {

    // on componentWillMount, invoke our callAPI saga to get our data
    const { dispatch } = this.props;

    dispatch(callAPI());
  }

  render() {

    // check if we're fetching data - if so, render a spinner
    // else, render our UI
    const { maps } = this.props;

    // TODO - implement a Spinner solution
    let component = maps.fetchingData ?
      <div></div> :
      <Fragment forRoute='/'>
      <div className='page-container'>
        <Link href='/parker'>
          <div className='chevron'>
            <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path fill="#6C7680" d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"/>
            </svg>
          </div>
        </Link>
          <Fragment forRoute='/home'>
            <Home />
          </Fragment>
          <Fragment forRoute='/parker'>
            <div>It's the Doo!</div>
          </Fragment>
        {/* <Header />
        <div className='percapita'>
          <Map mapType='choropleth' />
          <MapDescription mapType='choropleth' insetHeader='Shootings per Million' />
        </div>
        <div className='raw'>
          <Map mapType='proportional' />
          <MapDescription mapType='proportional' insetHeader='Total Shootings'/>
        </div> */}
        <div className='chevron'>
          <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path fill="#6C7680" d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"/>
          </svg>
        </div>
      </div>
      </Fragment>;

    return component;
  }
}

const mapStateToProps = (state) => {
  return {
    maps: state.mapReducer
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

