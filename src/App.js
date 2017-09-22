import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Map from './components/maps/Map';
import MapDescription from './components/maps/MapDescription';
import { callAPI } from './actions/actions';
import PropTypes from 'prop-types';

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
      <div className='page-container'>
        <div className='chevron'></div>
        <Home />
        {/* <Header />
        <div className='percapita'>
          <Map mapType='choropleth' />
          <MapDescription mapType='choropleth' insetHeader='Shootings per Million' />
        </div>
        <div className='raw'>
          <Map mapType='proportional' />
          <MapDescription mapType='proportional' insetHeader='Total Shootings'/>
        </div> */}
        <div className='chevron'></div>
      </div>;

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

