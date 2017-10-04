// import necessary modules
import * as actionTypes from '../constants/action-types';

// define our initial reducer state
const initialState = {
	fetchingData: true,
    geoData: [],
	shootingsData: [],
	censusData: [],
	activeState: {
		stateName: 'New Mexico',
		shootings: 43,
		shootingsPerMillion: 20.66
	}
};

export const mapReducer = (state = initialState, action) => {
  switch (action.type) {
		case actionTypes.CALL_API:
			return {...state,
				fetchingData: true
			};
		case actionTypes.REQUEST_TOPOJSON_DATA:
			return state;
        case actionTypes.SEND_API_DATA_TO_REDUCER:
            return {...state,
                geoData: action.data,
                fetchingData: false
            };
		case actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER:
			return { ...state,
				shootingsData: action.data
			};
		case actionTypes.SEND_CENSUS_DATA_TO_REDUCER:
			return {
				...state,
				censusData: action.censusData
			};
		case actionTypes.GET_HOVERED_STATE_DATA:
			return { ...state,
				activeState: action.state
			};
        default:
            return state;
  }
};
