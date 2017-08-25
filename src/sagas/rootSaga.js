import { put, takeEvery, takeLatest, all, call } from 'redux-saga/effects';
import axios from 'axios';
import * as actionTypes from '../constants/action-types';

function* helloSagas() {
    console.log('Hello sagas!');
}

export function* watchAPICall() {
    console.log('watchAPI saga invoked.');
    yield takeEvery('CALL_API', callAPI);
}

export function* callAPI() {
    console.log('callAPI saga invoked.');
    const data = yield call(() => {
        return axios.all([
        axios.get('https://thecountedapi.com/api/counted'),
        axios.get('https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&key=3cb72d0b9a80896c19992beee5e32be81aa2ca61')
    ])});
    console.log(data[0].data);
    
    yield put({ type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER, data: data[0].data });
}

export default function* rootSaga() {
    yield all([
        helloSagas(),
        watchAPICall()
    ])
}

// export function* getAPIData() {
//}