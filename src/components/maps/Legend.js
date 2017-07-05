import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import * as _ from 'lodash';
import * as d3 from 'd3';

class Legend extends React.Component{

	constructor() {
		super();
	}

	componentDidMount() {

		// now create a legend. start by storing all color values in an array
    let colorLegend = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)"];

		// define a new legend
    let svgLegend = d3.select('.map')//.append('svg')
                      //.attr('width', 250)
                      //.attr('height', 80)
											//.attr('viewBox', '0 0 250 80');

    svgLegend.append("g")
       .selectAll("rect")
       .data(colorLegend)
       .enter()
       .append("rect")
       .attr("fill", function(d, i){ return colorLegend[i]; })
       .attr("x", function(d, i){ return (i*30); })
       .attr("y", 30)
       .attr("width", 30)
       .attr("height", 20);

    // add a legend title
    svgLegend.append("text")
      .attr("font-size", "12px")
      .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
      .attr("y", 20)
      .text("Shootings Per Million");

    // add numbers to legend
    let labelsLegend = ["0-1","1-3","3-5","5-7","7-10","10-12","12-15",">15"];
    svgLegend.append("g")
      .attr("class", "legend-labels")
      .selectAll("text")
      .data(labelsLegend)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("font-family", "HelveticaNeue-Light, Helvetica, sans-serif")
      .attr("x", function(d, i){ return (i*30); })
      .attr("y", 60)
      .text(function(d){ return d; })
	}

	render() {

		return <div id='percapita-legend' className='legend'></div>;
	}
}

export default Legend;
