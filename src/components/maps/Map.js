import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from './State';
import * as stateNames from '../../assets/state-names';
import axios from 'axios';
import * as actions from '../../actions/actions';

class Map extends React.Component {

  constructor() {
    super();
    // this.state = { us: '' };
  }

  componentWillMount() {

    d3.json("https://d3js.org/us-10m.v1.json", (error, us) => {
      if (error) throw error;

			axios.all([
								axios.get('https://thecountedapi.com/api/counted'),
								axios.get('http://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&key=3cb72d0b9a80896c19992beee5e32be81aa2ca61')
					  ])
					 .then(axios.spread((countedAPI, censusAPI) => {


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
							});

						this.props.dispatch(actions.sendAPIDataToReducer({ us }));

					}))
					 .catch((err) => {
						 console.log(err);
					 });
    });

  }

  render() {

    let geoPath = d3.geoPath();

    let data = this.props.maps.data.objects ? topojson.feature(this.props.maps.data, this.props.maps.data.objects.states).features : null;

    const featurePath = () => {
        if (data) {
          let pathComponent = _.map(data, (feature, i) => {
            let path = geoPath(feature);
            return <State numShootings={feature.properties.numShootings} population={feature.properties.population} path={path} key={i} />;
          });
          return pathComponent;
        }
    }

    return (
      <svg className='map-container' width="960" height="600" viewBox="0 0 960 600">
          <g>
            {featurePath()}
          </g>
      </svg>
    );
  }
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(Map);
