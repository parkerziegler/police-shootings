import * as actionTypes from '../constants/action-types';

export const callAPI = () => {

	return {
		type: actionTypes.CALL_API
	};
};

export const requestTopojsonData = () => {

	return {
		type: actionTypes.REQUEST_TOPOJSON_DATA
	};
};

export const sendAPIDataToReducer = (data) => {

  return {
    type: actionTypes.SEND_API_DATA_TO_REDUCER,
    data
  };
};

export const sendShootingsDataToReducer = (data) => {

	return {
		type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER,
		data
	};
};

export const getHoveredStateData = (state) => {

	return {
		type: actionTypes.GET_HOVERED_STATE_DATA,
		state
	};
};
