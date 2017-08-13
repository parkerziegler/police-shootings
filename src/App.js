import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Map from './components/maps/Map';
import MapDescription from './components/maps/MapDescription';

class App extends Component {
  render() {

    return (
      <div>
        <Header />
				<div className='percapita'>
	        <Map mapType='choropleth' />
					<MapDescription />
				</div>
        <div className='raw'>
          <Map mapType='proportional' />
        </div>
      </div>
    );
  }
}

export default App;
