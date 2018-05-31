import { call, put, takeLatest, select } from 'redux-saga/effects';
import { groupBy, drop, findKey } from 'lodash';
import axios from 'axios';
import { initializeCurrentLocation } from 'redux-little-router';

import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import { CENSUS_API_KEY } from '../config';

// define a watcher generator to listen for when CALL_API is dispatched
export function* watchAPICall() {
  yield takeLatest('CALL_API', callAPI);
}

// define a function that will return our axios promise
export const axiosCallAPI = () => {
  return axios.all([
    axios.get('https://d3js.org/us-10m.v1.json'),
    axios.get(`${process.env.PUBLIC_URL}/shootings-data.json`),
    axios.get(
      'https://api.census.gov/data/2015/acs5?get=B02001_003E,B03002_012E,B02001_005E,B02001_004E,B02001_002E,B01003_001E&for=state:*&key=' +
        CENSUS_API_KEY
    ),
  ]);
};

// define a sagahandle fetching our API data
export function* callAPI(action) {
  try {
    // call the API, using yield to wait for its response
    const [topojson, shootingsData, censusData] = yield call(axiosCallAPI);
    // send the raw shootings data off to redux for storage
    yield put({
      type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER,
      data: shootingsData.data,
    });

    // group the shootings data by state
    const dataByState = groupBy(shootingsData.data, 'state');

    // reformat the census data
    const populationStats = drop(censusData.data).map(state => {
      return {
        id: parseInt(state[state.length - 1], 10),
        populationBlack: parseInt(state[0], 10),
        populationHispanic: parseInt(state[1], 10),
        populationAsian: parseInt(state[2], 10),
        populationAIAN: parseInt(state[3], 10),
        populationWhite: parseInt(state[4], 10),
        populationTotal: parseInt(state[5], 10),
      };
    });

    // next, modify the topojson data and join the attributes from the shootings data
    // we can just modify the existing object in place
    topojson.data.objects.states.geometries.forEach(state => {
      // parse the id as an int to join it to state data
      console.log('58');
      state.id = parseInt(state.id, 10);
      const key = findKey(stateNames, ({ id }) => id === state.id);
      const matchState = stateNames[key];
      console.log('62');

      // once we have a match state, use it to obtain shooting and population data
      const matchShootings = dataByState[matchState.code];
      const matchPopulation = populationStats.find(
        ({ id }) => id === matchState.id
      );
      console.log(matchShootings);
      console.log('69');

      // finally, recompose the state object
      state.properties = {
        stateAbbreviation: matchState.code,
        stateName: matchState.name,
        numShootings: matchShootings ? matchShootings.length : 0,
        population: matchPopulation.populationTotal,
        populationTotal: matchPopulation.populationTotal,
        shootingsPerCapita: matchShootings
          ? matchShootings.length / matchPopulation.populationTotal
          : 0,
        populationBlack: matchPopulation.populationBlack,
        populationHispanic: matchPopulation.populationHispanic,
        populationAsian: matchPopulation.populationAsian,
        populationAIAN: matchPopulation.populationAIAN,
        populationWhite: matchPopulation.populationWhite,
      };
    });

    // once processing finishes, send the newly altered topojson data from d3 off to redux
    // also send off the Census data for easy access
    yield put({
      type: actionTypes.SEND_API_DATA_TO_REDUCER,
      data: topojson.data,
    });

    yield put({
      type: actionTypes.SEND_CENSUS_DATA_TO_REDUCER,
      censusData: populationStats,
    });

    // initalize the location so redux-little-router works with sagas
    const router = yield select(state => state.router);
    if (router) {
      yield put(initializeCurrentLocation(router));
    }
  } catch (error) {
    // log the error
    // console.log(error);
  }
}
