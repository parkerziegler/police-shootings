import * as actionTypes from '../constants/action-types';

const initialState = {
	fetchingData: true,
  data: [{}],
	shootingsData: [{}],
	activeState: {
		stateName: 'New Mexico',
		shootings: 43,
		shootingsPerMillion: 20.66
	}
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
		case actionTypes.CALL_API:
			return {...state,
				fetchingData: true
			};
		case actionTypes.REUQEST_TOPOJSON_DATA:
			return state;
    case actionTypes.SEND_API_DATA_TO_REDUCER:
      return Object.assign({}, state, {
				data: action.data,
				fetchingData: false
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
