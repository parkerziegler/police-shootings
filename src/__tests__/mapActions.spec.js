import * as actionTypes from '../constants/action-types';
import {
  callAPI,
  sendAPIDataToReducer,
  sendShootingsDataToReducer,
  getHoveredStateData,
} from '../actions/mapActions';

describe('testing all mapActions', () => {
  it('fires the callAPI saga', () => {
    const expectedAction = {
      type: actionTypes.CALL_API,
    };

    expect(callAPI()).toEqual(expectedAction);
  });

  it('sends the API data to the reducer', () => {
    const data = [{ state: 'WA' }];

    const expectedAction = {
      type: actionTypes.SEND_API_DATA_TO_REDUCER,
      data,
    };

    expect(sendAPIDataToReducer(data)).toEqual(expectedAction);
  });

  it('sends the shootings data to the reducer', () => {
    const data = [
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
    ];

    const expectedAction = {
      type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER,
      data,
    };

    expect(sendShootingsDataToReducer(data)).toEqual(expectedAction);
  });

  it('notifies the reducer of the hovered state', () => {
    const state = {
      stateName: 'WA',
      shootings: 45,
      shootingsPerMillion: 9.85,
    };

    const expectedAction = {
      type: actionTypes.GET_HOVERED_STATE_DATA,
      state,
    };

    expect(getHoveredStateData(state)).toEqual(expectedAction);
  });
});
