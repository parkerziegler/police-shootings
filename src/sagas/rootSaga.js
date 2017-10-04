import { put, takeLatest, all, call, select } from 'redux-saga/effects';
import axios from 'axios';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import * as _ from 'lodash';
import { CENSUS_API_KEY } from '../config';

// define a watcher generator to listen for when CALL_API is dispatched
export function* watchAPICall() {
    yield takeLatest('CALL_API', callAPI);
}

// define a function that will return our axios promise
const axiosCall = () => {

    return axios.all([
        axios.get("https://d3js.org/us-10m.v1.json"),
        axios.get('https://thecountedapi.com/api/counted'),
        axios.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&key=' + CENSUS_API_KEY),
    ]);
};

// define a generator to be handle fetching our API data
function* callAPI() {

    // call the API, using yield to wait for its response
    const response = yield call(axiosCall);

    // do the same with the shootings data from the Counted API
    yield put({ type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER, data: response[1].data });

    // group the shootings data by state
    let dataByState = _.groupBy(response[1].data, 'state');
    
    // next, modify the topojson data to and join the attributes from the shootings data
    _.map(response[0].data.objects.states.geometries, (state) => {

        // parse the id as an int so we can join it to the state data lookup we have
        // stored in constants
        state.id = _.parseInt(state.id);
        let matchState = _.find(stateNames, ['id', state.id]);

        // once we have a match state, use it to obtain population data from the Census
        let matchShootings = dataByState[matchState.code];

        // some lodash trickery to make the join
        let populationData = _.invert(_.fromPairs(response[2].data));
        let matchPopulation = _.parseInt(populationData[matchState.name]);

        // finally
        state.properties = {};
        state.properties.stateAbbreviation = matchState.code;
        state.properties.stateName = matchState.name;
        state.properties.numShootings = matchShootings.length;
        state.properties.population = matchPopulation;
        state.properties.shootingsPerCapita = matchShootings.length / matchPopulation;

    });

    // once it returns, send the topojson data from d3 off to redux
    yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: response[0].data });

}

// define a watcher saga to listen for when ROUTER_LOCATION_CHANGED is dispatched by the router
function* watchLocationChanged() {
    yield takeLatest('ROUTER_LOCATION_CHANGED', handleLocationChanged);
}

// a lookup defining which filters to put when a particular route is hit
const shootingsFilters = {
    '/total-shootings': '',
    '/total-shootings/black': '?race=Black',
    '/total-shootings/hispanic': '?race=Hispanic/Latino'
};

function* handleLocationChanged(action) {

    try {

        // obtain the proper filter based on the route
        let apiFilter = shootingsFilters[action.payload.route];

        yield put({ type: actionTypes.SET_FILTERS_ON_SHOOTINGS_DATA, apiFilter });
        
    } catch (error) {
        console.log(error);
    }
    
}


export default function* rootSaga() {
    yield all([
        watchAPICall(),
        watchLocationChanged()
    ])
}
