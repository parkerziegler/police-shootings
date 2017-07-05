import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from './State';
import Legend from './Legend';
import * as stateNames from '../../assets/state-names';
import axios from 'axios';
import * as actions from '../../actions/actions';

class Map extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

		// fetch the data - we'll just use a simplified topojson from Mike Bostock
    d3.json("https://d3js.org/us-10m.v1.json", (error, us) => {
      if (error) throw error;

			// send off concurrent requests for the shootings data and census data
			axios.all([
								axios.get('https://thecountedapi.com/api/counted'),
								axios.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&key=3cb72d0b9a80896c19992beee5e32be81aa2ca61')
					  ])
					 .then(axios.spread((countedAPI, censusAPI) => {

						 // spread the responses, starting with the shootings data
						 // send the data to redux for later storage
						 this.props.dispatch(actions.sendShootingsDataToReducer(countedAPI.data));
						 let dataByState = _.groupBy(countedAPI.data, 'state');

						 _.map(us.objects.states.geometries, (state) => {
								state.id = _.parseInt(state.id);

								let matchState = _.find(stateNames, ['id', state.id]);
								let matchShootings = dataByState[matchState.code];
								let populationData = _.invert(_.fromPairs(censusAPI.data));
								let matchPopulation = _.parseInt(populationData[matchState.name]);

								state.properties = {};
								state.properties.stateAbbreviation = matchState.code;
								state.properties.stateName = matchState.name;
								state.properties.numShootings = matchShootings.length;
								state.properties.population = matchPopulation;
								state.properties.shootingsPerCapita = matchShootings.length / matchPopulation;
							});

						this.props.dispatch(actions.sendAPIDataToReducer({ us }));

					}))
					 .catch((err) => {
						 console.log(err);
					 });
    });

  }

	componentDidMount() {

		// now create a legend. start by storing all color values in an array
    let colorLegend = ["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)"];

		// define a new legend
    let svgLegend = d3.select('.map').append('svg');

    svgLegend.append("g")
			 .attr("transform", "translate(500, 525)")
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
		  .attr("transform", "translate(500, 525)")
      .attr("font-size", "12px")
      .attr("font-family", "HelveticaNeue-Bold, Helvetica, sans-serif")
      .attr("y", 20)
      .text("Shootings Per Million");

    // add numbers to legend
    let labelsLegend = ["0-1","1-3","3-5","5-7","7-10","10-12","12-15",">15"];
    svgLegend.append("g")
      .attr("transform", "translate(500, 525)")
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

    let geoPath = d3.geoPath();

    let data = this.props.maps.data.objects ? topojson.feature(this.props.maps.data, this.props.maps.data.objects.states).features : null;

    const featurePath = () => {
        if (data) {
          let pathComponent = _.map(data, (feature, i) => {
            let path = geoPath(feature);
            return <State stateName={feature.properties.stateName} numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} key={i} />;
          });
          return pathComponent;
        }
    }

    return (
			<div className='map-container'>
	      <svg className='map' width="960" height="600" viewBox="0 0 960 600">
	          <g>
	            {featurePath()}
	          </g>
	      </svg>
			</div>
    );
  }
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(Map);
