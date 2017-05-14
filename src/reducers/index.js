import * as actionTypes from '../constants/action-types';

const initialState = {
  data: [{}]
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_API_DATA_TO_REDUCER:
      return Object.assign({}, state, {
        data: action.data
      });
    default:
      return state;
  }
}
