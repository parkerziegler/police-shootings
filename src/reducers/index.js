import * as actionTypes from '../constants/action-types';

const initialState = {
  data: [{}],
	shootingsData: [{}],
	activeState: {}
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_API_DATA_TO_REDUCER:
      return Object.assign({}, state, {
        data: action.data.us
      });
		case actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER:
			return Object.assign({}, state, {
				shootingsData: action.data
			});
		case actionTypes.GET_HOVERED_STATE_DATA:
			return Object.assign({}, state, {
				activeState: action.state
			});
    default:
      return state;
  }
}
