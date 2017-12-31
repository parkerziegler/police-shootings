import { call, put } from 'redux-saga/effects';
import { callAPI, axiosCallAPI } from './mapSagas';
import { CALL_API, SEND_SHOOTINGS_DATA_TO_REDUCER } from '../constants/action-types';
    
it('should make the API request on generator start', () => {

    const generator = callAPI({ type: CALL_API });

    expect(generator.next().value).toEqual(call(axiosCallAPI));

});
