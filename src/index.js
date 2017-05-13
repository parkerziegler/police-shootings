import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as d3 from 'd3';
import * as topojson from 'topojson';

let svg = d3.select('#perCapitaMap');
let path = d3.geoPath();

// load the d3 topojson of the us
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append('g')
     .attr('class', 'states')
     .selectAll('path')
     .data(topojson.feature(us, us.objects.states).features)
     .enter()
     .append('path')
     .attr('d', path);

  svg.append('path')
     .attr('class', 'state-borders')
     .attr('d', path(topojson.mesh(us, us.objects.states, (a, b) => a !== b )));
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
