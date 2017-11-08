import { put, takeLatest, select } from 'redux-saga/effects';
import * as _ from 'lodash';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import moment from 'moment';

// define a watcher saga to listen for when ROUTER_LOCATION_CHANGED is dispatched by the router
export function* watchLocationChanged() {
    yield takeLatest('ROUTER_LOCATION_CHANGED', handleLocationChanged);
}

// a lookup defining which filters to apply on the data when a particular
// route is hit
const shootingsFilters = {
    '/': { filterKey: null, filterValue: null, populationValue: 'population' },
    '/total-shootings': { filterKey: null, filterValue: null, populationValue: 'population' },
    '/total-shootings/black': { filterKey: 'race', filterValue: 'Black', populationValue: 'population' },
    '/total-shootings/latino': { filterKey: 'race', filterValue: 'Hispanic/Latino', populationValue: 'population' },
    '/total-shootings/asian': { filterKey: 'race', filterValue: 'Asian/Pacific Islander', populationValue: 'population' },
    '/total-shootings/nativeamerican': { filterKey: 'race', filterValue: 'Native American', populationValue: 'population'},
    '/total-shootings/white': { filterKey: 'race', filterValue: 'White', populationValue: 'population' },
    '/percapita': { filterKey: null, filterValue: null, populationValue: 'populationTotal' },
    '/percapita/black': { filterKey: 'race', filterValue: 'Black', populationValue: 'populationBlack' },
    '/percapita/latino': { filterKey: 'race', filterValue: 'Hispanic/Latino', populationValue: 'populationHispanic' },
    '/percapita/asian': { filterKey: 'race', filterValue: 'Asian/Pacific Islander', populationValue: 'populationAsian' },
    '/percapita/nativeamerican': { filterKey: 'race', filterValue: 'Native American', populationValue: 'populationAIAN' },
    '/percapita/white': { filterKey: 'race', filterValue: 'White', populationValue: 'populationWhite' },
    '/shootingsbydate': { filterKey: null, filterValue: null, populationValue: 'population' }
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

// a function for joining the shootingsData and geoData together
// this function get run when we change routes and need to recompose
// our topojson object in place
const joinShootingsDataToGeoData = (shootingsData, geoData, populationFilter) => {

    if (!geoData) {
        return;
    } else {
        let dataByState = _.groupBy(shootingsData, 'state');
        
         _.map(geoData.objects.states.geometries, (state) => {
    
            // parse the id as an int so we can join it to the state data lookup we have
            // stored in constants
            state.id = _.parseInt(state.id);
            let matchState = _.find(stateNames, ['id', state.id]);
    
            // once we have a match state, use it to obtain
            // the number of shootings
            let matchShootings = dataByState[matchState.code];
            let numShootings = matchShootings ? matchShootings.length : 0;
            let population = state.properties[populationFilter];
    
            // finally, recompose the object
            state.properties = {
                ...state.properties,
                numShootings,
                population
            };
        });
    
        return geoData;
    }
};

// our generator function to run our handleLocationChanged saga
function* handleLocationChanged(action) {

    try {

        // read the shootings data from the redux store
        const reduxStore = yield select();

        // check if this route needs data
        let router = reduxStore.router;

        if (router.routes[action.payload.route].index === 1 || router.routes[action.payload.route].index === 2 || (router.routes[action.payload.route].childIndex >= 0 && router.routes[action.payload.route].childIndex <= 4)) {

            let shootingsData = reduxStore.mapReducer.shootingsData;

            // obtain the proper data filter based on the route
            let { filterKey, filterValue, populationValue } = shootingsFilters[action.payload.route];

            // filter the shootings data
            let filteredData = filterShootingsData(shootingsData, filterKey, filterValue);

            // join it to the topojson data
            let geoData = joinShootingsDataToGeoData(filteredData, reduxStore.mapReducer.geoData, populationValue);
            
            // send this data to redux so our Map component can read from it
            yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: geoData });
        }

        if (router.routes[action.payload.route].index === 3) {

            // a function for generating different colors on bars of different heights
            const getColor = (count) => {

                if (count < 2){
                    return "#dadaeb";
                }
                else if (count < 4){
                    return "#bcbddc";
                }
                else if (count < 6){
                    return "#9e9ac8";
                }
                else {
                    return "#756bb1";
                }
            };

            // we'll handle the shootings by date route separately
            let shootingsData = reduxStore.mapReducer.shootingsData; 

            // we need to obtain all dates within the range Jan 1, 2015 - Dec 1, 2015
            const getAllDatesInRange = (startDate, endDate) => {

                let dateArray = [];
                while (moment(startDate, "MM/DD/YYYY").isSameOrBefore(moment(endDate, "MM/DD/YYYY"))) {

                    dateArray.push(moment(startDate, "MM/DD/YYYY").valueOf());
                    startDate = moment(startDate, "MM/DD/YYYY").add(1, 'day');
                };
                return dateArray;
            };

            let allDates = getAllDatesInRange('01/01/2015', '12/31/2016');

			let dates = _.map(shootingsData, (record) => {
				return moment(`${record.month} - ${record.day} - ${record.year}`, "MMMM - D - YYYY").valueOf();
            });
            
            let daysWithNoShootings = _.difference(allDates, dates);

            // group shootings by their date
			let groupByDate = _.groupBy(_.concat(dates, daysWithNoShootings), date => date);

            // return data - we'll send this off to redux to be consumed by victory
			let shootingsByDate = _.map(_.keys(groupByDate), (key) => {

				return { date: _.parseInt(key, 10), count: groupByDate[key].length, color: getColor(groupByDate[key].length) }
            });
            
            yield put({ type: actionTypes.SEND_SHOOTINGS_BY_DATE_TO_REDUCER, shootingsByDate: shootingsByDate.sort((a, b) => a - b) });
        }
        
    } catch (error) {

        // log any errors
        console.log(error);
    }
    
}