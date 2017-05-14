import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import PerCapitaMapContainer from './components/percapita/PerCapitaMapContainer';

class App extends Component {
  render() {

    return (
      <div>
        <Header />
        <PerCapitaMapContainer />
      </div>
    );
  }
}

export default App;
