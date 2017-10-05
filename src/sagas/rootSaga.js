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

// define a function for filtering the data based on the route
// i.e. when we navigate to total-shootings/black, filter the
// data by race

// define a generator to be handle fetching our API data
function* callAPI(action) {

    try {

        // call the API, using yield to wait for its response
        const response = yield call(axiosCall);
    
        // send the raw data off to redux for storage
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

        yield put({ type: actionTypes.SEND_CENSUS_DATA_TO_REDUCER, censusData: response[2].data });

    } catch (error) {
        
        // log the error
        console.log(error);
    }

}

// define a watcher saga to listen for when ROUTER_LOCATION_CHANGED is dispatched by the router
function* watchLocationChanged() {
    yield takeLatest('ROUTER_LOCATION_CHANGED', handleLocationChanged);
}

// a lookup defining which filters to put when a particular route is hit
const shootingsFilters = {
    '/': { filterKey: null, filterValue: null },
    '/total-shootings': { filterKey: null, filterValue: null },
    '/total-shootings/black': { filterKey: 'race', filterValue: 'Black' },
    '/total-shootings/latino': { filterKey: 'race', filterValue: 'Hispanic/Latino' },
    '/total-shootings/asian': { filterKey: 'race', filterValue: 'Asian/Pacific Islander' },
    '/total-shootings/nativeamerican': { filterKey: 'race', filterValue: 'Native American'},
    '/total-shootings/white': { filterKey: 'race', filterValue: 'White' },
    '/percapita': { filterKey: null, filterValue: null },
    '/shootingsbydate': { filterKey: null, filterValue: null }
};

const filterShootingsData = (data, filterKey = null, filterValue = null) => {
    
    // copy over the data
    let clone = [...data];

    if (filterKey && filterValue) {
        return clone.filter((entry) => {
            return entry[filterKey] === filterValue;
        });
    } else {
        return clone;
    }
};

const joinShootingsDataToGeoData = (shootingsData, geoData, censusData) => {

    if (!geoData) {
        return;
    } else {
        let dataByState = _.groupBy(shootingsData, 'state');
        
        _.map(geoData.objects.states.geometries, (state) => {
    
            // parse the id as an int so we can join it to the state data lookup we have
            // stored in constants
            state.id = _.parseInt(state.id);
            let matchState = _.find(stateNames, ['id', state.id]);
    
            // once we have a match state, use it to obtain population data from the Census
            let matchShootings = dataByState[matchState.code];
            let numShootings = matchShootings ? matchShootings.length : 0;
    
            // some lodash trickery to make the join
            let populationData = _.invert(_.fromPairs(censusData));
            let matchPopulation = _.parseInt(populationData[matchState.name]);
    
            // finally, recompose the object
            state.properties = {};
            state.properties.stateAbbreviation = matchState.code;
            state.properties.stateName = matchState.name;
            state.properties.numShootings = numShootings;
            state.properties.population = matchPopulation;
            state.properties.shootingsPerCapita = numShootings / matchPopulation;
    
            return state;
        });
    
        return geoData;
    }
}

function* handleLocationChanged(action) {

    try {

        const reduxStore = yield select();
        let shootingsData = reduxStore.mapReducer.shootingsData;

        // obtain the proper filter based on the route
        let { filterKey, filterValue } = shootingsFilters[action.payload.route];

        let filteredData = filterShootingsData(shootingsData, filterKey, filterValue);

        let geoData = joinShootingsDataToGeoData(filteredData, reduxStore.mapReducer.geoData, reduxStore.mapReducer.censusData);
        
        yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: geoData });
        
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
