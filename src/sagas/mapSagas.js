import { call, put, takeLatest } from 'redux-saga/effects';
import * as _ from 'lodash';
import axios from 'axios';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import { CENSUS_API_KEY } from '../config';

// define a watcher generator to listen for when CALL_API is dispatched
export function* watchAPICall() {
    yield takeLatest('CALL_API', callAPI);
}

// define a function that will return our axios promise
const axiosCallAPI = () => {

    return axios.all([
        axios.get("https://d3js.org/us-10m.v1.json"),
        axios.get('https://thecountedapi.com/api/counted'),
        axios.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&key=' + CENSUS_API_KEY),
    ]);
};

// define a generator to be handle fetching our API data
function* callAPI(action) {

    try {

        // call the API, using yield to wait for its response
        const response = yield call(axiosCallAPI);
    
        // send the raw shootings data off to redux for storage
        yield put({ type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER, data: response[1].data });
    
        // group the shootings data by state
        let dataByState = _.groupBy(response[1].data, 'state');
        
        // next, modify the topojson data and join the attributes from the shootings data
        // we can just modify the existing object in place
        _.map(response[0].data.objects.states.geometries, (state) => {
    
            // parse the id as an int so we can join it to the state data lookup we have
            // stored in constants
            state.id = _.parseInt(state.id);
            let matchState = _.find(stateNames, ['id', state.id]);
    
            // once we have a match state, use it to obtain population data from the Census
            let matchShootings = dataByState[matchState.code];
    
            // some lodash trickery to make the join and deal with the schema design
            // of the Census API
            let populationData = _.invert(_.fromPairs(response[2].data));
            let matchPopulation = _.parseInt(populationData[matchState.name]);
    
            // finally, recompose the state object
            state.properties = {};
            state.properties.stateAbbreviation = matchState.code;
            state.properties.stateName = matchState.name;
            state.properties.numShootings = matchShootings.length;
            state.properties.population = matchPopulation;
            state.properties.shootingsPerCapita = matchShootings.length / matchPopulation;
    
        });
    
        // once processing finishes, send the newly altered topojson data from d3 off to redux
        // also send off the Census data for easy access
        yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: response[0].data });
        yield put({ type: actionTypes.SEND_CENSUS_DATA_TO_REDUCER, censusData: response[2].data });

    } catch (error) {
        
        // log the error
        console.log(error);
    }

}
