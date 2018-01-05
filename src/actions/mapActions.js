import * as actionTypes from "../constants/action-types";

export const callAPI = () => {
  return {
    type: actionTypes.CALL_API
  };
};

export const sendAPIDataToReducer = data => {
  return {
    type: actionTypes.SEND_API_DATA_TO_REDUCER,
    data
  };
};

export const sendShootingsDataToReducer = data => {
  return {
    type: actionTypes.SEND_SHOOTINGS_DATA_TO_REDUCER,
    data
  };
};

export const getHoveredStateData = state => {
  return {
    type: actionTypes.GET_HOVERED_STATE_DATA,
    state
  };
};

export const sendCensusDataToReducer = censusData => {
  return {
    type: actionTypes.SEND_CENSUS_DATA_TO_REDUCER,
    censusData
  };
};

export const setTemporalFilterOnShootingsData = temporalFilter => {
  return {
    type: actionTypes.SET_TEMPORAL_FILTER_ON_SHOOTINGS_DATA,
    temporalFilter
  };
};

export const sendShootingsByDateToReducer = shootingsByDate => {
  return {
    type: actionTypes.SEND_SHOOTINGS_BY_DATE_TO_REDUCER,
    shootingsByDate
  };
};
