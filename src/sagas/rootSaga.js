import { put, takeEvery, takeLatest, all, call } from 'redux-saga/effects';
import axios from 'axios';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import * as _ from 'lodash';
import { CENSUS_API_KEY } from '../config';


export function* watchAPICall() {
    yield takeEvery('CALL_API', callAPI);
}

export function* callAPI() {
    const response = yield call(() => {
        return axios.all([
            axios.get("https://d3js.org/us-10m.v1.json"),
            axios.get('https://thecountedapi.com/api/counted'),
            axios.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&key=' + CENSUS_API_KEY),
        ])
    });

    yield put({ type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER, data: response[1].data });

    let dataByState = _.groupBy(response[1].data, 'state');
    
    _.map(response[0].data.objects.states.geometries, (state) => {
        state.id = _.parseInt(state.id);

        let matchState = _.find(stateNames, ['id', state.id]);
        let matchShootings = dataByState[matchState.code];
        let populationData = _.invert(_.fromPairs(response[2].data));
        let matchPopulation = _.parseInt(populationData[matchState.name]);

        state.properties = {};
        state.properties.stateAbbreviation = matchState.code;
        state.properties.stateName = matchState.name;
        state.properties.numShootings = matchShootings.length;
        state.properties.population = matchPopulation;
        state.properties.shootingsPerCapita = matchShootings.length / matchPopulation;

    });

    yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: response[0].data });

}

export default function* rootSaga() {
    yield all([
        watchAPICall()
    ])
}
