import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { callAPI, axiosCallAPI } from '../sagas/mapSagas';
import {
  CALL_API,
  SEND_SHOOTINGS_DATA_TO_REDUCER,
  SEND_API_DATA_TO_REDUCER,
} from '../constants/action-types';

describe('mapSagas', () => {
  const mock = [
    { data: 'topojson' },
    { data: 'shootingsData' },
    { data: 'censusData' },
  ];

  it('should execute the saga correctly', () => {
    const generator = cloneableGenerator(callAPI)();
    expect(generator.next().value).toEqual(call(axiosCallAPI));
    expect(generator.next(mock).value).toEqual(
      put({ type: SEND_SHOOTINGS_DATA_TO_REDUCER, data: 'shootingsData' })
    );
  });
});
