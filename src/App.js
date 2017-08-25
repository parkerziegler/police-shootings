import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './components/Header';
import Map from './components/maps/Map';
import MapDescription from './components/maps/MapDescription';
import * as actions from './actions/actions';

class App extends Component {

  componentWillMount() {
    this.props.dispatch(actions.callAPI());
  }

  render() {

    return (
      <div>
        <Header />
				<div className='percapita'>
	        <Map mapType='choropleth' />
					<MapDescription mapType='choropleth' insetHeader='Shootings per Million' />
				</div>
        <div className='raw'>
          <Map mapType='proportional' />
          <MapDescription mapType='choropleth' insetHeader='Total Shootings'/>
        </div>
      </div>
    );
  }
}

export default connect()(App);
