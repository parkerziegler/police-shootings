import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import {
  handleLocationChanged,
  watchLocationChanged,
} from '../sagas/routerSagas';
import * as actionTypes from '../constants/action-types';

describe('routerSagas', () => {
  const mockState = {
    mapReducer: {
      shootingsData: [
        {
          uid: 2,
          name: 'Matthew Ajibade',
          age: '22',
          gender: 'Male',
          raceethnicity: 'Black',
          month: 'January',
          day: 1,
          year: 2015,
          streetaddress: '1050 Carl Griffin Dr',
          city: 'Savannah',
          state: 'GA',
          classification: 'Death in custody',
          lawenforcementagency: "Chatham County Sheriff's Office",
          armed: 'No',
        },
      ],
      geoData: {
        objects: {
          states: {
            geometries: [
              {
                id: 13,
                properties: {
                  stateAbbreviation: 'GA',
                  stateName: 'Georgia',
                  numShootings: 69,
                  population: 10006693,
                  populationTotal: 10006693,
                  shootingsPerCapita: 0.000006895384918873798,
                  populationBlack: 3096757,
                  populationHispanic: 915120,
                  populationAsian: 360448,
                  populationAIAN: 25887,
                  populationWhite: 6025691,
                },
              },
            ],
          },
        },
      },
    },
    router: {
      routes: {
        '/total-shootings': {
          type: 'map',
        },
        '/total-shootings/black': {
          type: 'map',
        },
        '/shootings-by-date': {
          type: 'line',
        },
      },
    },
  };

  const action = {
    type: 'ROUTER_LOCATION_CHANGED',
    payload: { route: '/total-shootings' },
  };

  it('hands off the ROUTER_LOCATION_CHANGED action to handleLocationChanged', () => {
    return expectSaga(watchLocationChanged)
      .withState(mockState)
      .dispatch(action)
      .silentRun();
  });

  it('handles map specific routes', () => {
    return expectSaga(handleLocationChanged, action)
      .withState(mockState)
      .put.actionType(actionTypes.SEND_API_DATA_TO_REDUCER)
      .run();
  });

  it('filters data to match request of sub-pathed routes', () => {
    return expectSaga(handleLocationChanged, {
      type: 'ROUTER_LOCATION_CHANGED',
      payload: { route: '/total-shootings/black' },
    })
      .withState(mockState)
      .put.actionType(actionTypes.SEND_API_DATA_TO_REDUCER)
      .run();
  });

  it('handles map routes with empty geoData', () => {
    return expectSaga(handleLocationChanged, {
      type: 'ROUTER_LOCATION_CHANGED',
      payload: { route: '/total-shootings/black' },
    })
      .withState({
        ...mockState,
        mapReducer: { ...mockState.mapReducer, geoData: null },
      })
      .put.actionType(actionTypes.SEND_API_DATA_TO_REDUCER)
      .run();
  });

  it('handles date specific routes', () => {
    return expectSaga(handleLocationChanged, {
      type: 'ROUTER_LOCATION_CHANGED',
      payload: { route: '/shootings-by-date' },
    })
      .withState(mockState)
      .put.actionType(actionTypes.SEND_SHOOTINGS_BY_DATE_TO_REDUCER)
      .run();
  });
});
