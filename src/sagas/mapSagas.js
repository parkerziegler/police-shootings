import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as _ from 'lodash';
import axios from 'axios';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import { CENSUS_API_KEY } from '../config';
import { initializeCurrentLocation } from 'redux-little-router';

// define a watcher generator to listen for when CALL_API is dispatched
export function* watchAPICall() {
    yield takeLatest('CALL_API', callAPI);
}

// define a function that will return our axios promise
const axiosCallAPI = () => {

    return axios.all([
        axios.get("https://d3js.org/us-10m.v1.json"),
        axios.get('https://thecountedapi.com/api/counted'),
        axios.get("https://api.census.gov/data/2015/acs5?get=B02001_003E,B03002_012E,B02001_005E,B02001_004E,B02001_002E,B01003_001E&for=state:*&key=" + CENSUS_API_KEY)
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

        let populationStats = _.drop(response[2].data).map((state) => {
            
            return {
                id: _.parseInt(state[state.length -1]),
                populationBlack: _.parseInt(state[0]),
                populationHispanic: _.parseInt(state[1]),
                populationAsian: _.parseInt(state[2]),
                populationAIAN: _.parseInt(state[3]),
                populationWhite: _.parseInt(state[4]),
                populationTotal: _.parseInt(state[5])
            };
        });
        
        // next, modify the topojson data and join the attributes from the shootings data
        // we can just modify the existing object in place
        _.map(response[0].data.objects.states.geometries, (state) => {
    
            // parse the id as an int so we can join it to the state data lookup we have
            // stored in constants
            state.id = _.parseInt(state.id);
            let matchState = _.find(stateNames, ['id', state.id]);
    
            // once we have a match state, use it to obtain population data from the Census
            let matchShootings = dataByState[matchState.code];

            let matchPopulation = _.find(populationStats, (item) => {
                return item.id === matchState.id;
            });
    
            // finally, recompose the state object
            state.properties = {
                stateAbbreviation: matchState.code,
                stateName: matchState.name,
                numShootings: matchShootings.length,
                population: matchPopulation.populationTotal,
                populationTotal: matchPopulation.populationTotal,
                shootingsPerCapita: matchShootings.length / matchPopulation.populationTotal,
                populationBlack: matchPopulation.populationBlack,
                populationHispanic: matchPopulation.populationHispanic,
                populationAsian: matchPopulation.populationAsian,
                populationAIAN: matchPopulation.populationAIAN,
                populationWhite: matchPopulation.populationWhite
            };
    
        });
    
        // once processing finishes, send the newly altered topojson data from d3 off to redux
        // also send off the Census data for easy access
        yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: response[0].data });
        yield put({ type: actionTypes.SEND_CENSUS_DATA_TO_REDUCER, censusData: populationStats });

        const reduxStore = yield select();

        if (reduxStore.router) {
            yield put(initializeCurrentLocation(reduxStore.router));
        }

    } catch (error) {
        
        // log the error
        console.log(error);
    }

}
