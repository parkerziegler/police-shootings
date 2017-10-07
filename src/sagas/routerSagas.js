import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as _ from 'lodash';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';

// define a watcher saga to listen for when ROUTER_LOCATION_CHANGED is dispatched by the router
export function* watchLocationChanged() {
    yield takeLatest('ROUTER_LOCATION_CHANGED', handleLocationChanged);
}

// a lookup defining which filters to apply on the data when a particular
// route is hit
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

// a function for filtering the shootings data
// accepts a single key-value pair
const filterShootingsData = (data, filterKey = null, filterValue = null) => {
    
    // copy over the data so we don't operate
    // on the original structure
    let clone = [...data];

    if (filterKey && filterValue) {
        return clone.filter((entry) => {
            return entry[filterKey] === filterValue;
        });
    } else {
        return clone;
    }
};

// a function for joining the shootingsData, geoData, and censusData together
// this function get run when we change routes and need to recompose
// our topojson object in place
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
};

// our generator function to run our handleLocationChanged saga
function* handleLocationChanged(action) {

    try {

        // read the shootings data from the redux store
        const reduxStore = yield select();
        let shootingsData = reduxStore.mapReducer.shootingsData;

        // obtain the proper data filter based on the route
        let { filterKey, filterValue } = shootingsFilters[action.payload.route];

        // filter the shootings data
        let filteredData = filterShootingsData(shootingsData, filterKey, filterValue);

        // join it to the topojson data
        let geoData = joinShootingsDataToGeoData(filteredData, reduxStore.mapReducer.geoData, reduxStore.mapReducer.censusData);
        
        // send this data to redux so our Map component can read from it
        yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: geoData });
        
    } catch (error) {

        // log any errors
        console.log(error);
    }
    
}