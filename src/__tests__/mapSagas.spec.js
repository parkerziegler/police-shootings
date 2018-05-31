import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { callAPI, axiosCallAPI } from '../sagas/mapSagas';
import * as actionTypes from '../constants/action-types';

describe('mapSagas', () => {
  const mock = [
    {
      data: {
        objects: {
          states: {
            geometries: [{ id: '05' }, { id: '06' }],
          },
        },
      },
    },
    {
      data: [
        {
          age: '22',
          armed: 'No',
          city: 'Savannah',
          classification: 'Death in custody',
          day: 1,
          gender: 'Male',
          lawenforcementagency: "Chatham County Sheriff's Office",
          month: 'January',
          name: 'Matthew Ajibade',
          raceethnicity: 'Black',
          state: 'GA',
          streetaddress: '1050 Carl Griffin Dr',
          uid: 2,
          year: 2015,
        },
      ],
    },
    {
      data: ['459748', '203226', '40336', '18409', '2307849', '2958208', '05'],
    },
  ];

  it('should run the main map saga correctly', () => {
    return expectSaga(callAPI)
      .withState({ router: {} })
      .provide([[matchers.call.fn(axiosCallAPI), [...mock]]])
      .put({
        type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER,
        data: mock[1].data,
      })
      .put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data: mock[0].data })
      .put.actionType(actionTypes.SEND_CENSUS_DATA_TO_REDUCER)
      .put.actionType('ROUTER_LOCATION_CHANGED')
      .run();
  });
});
