import * as actionTypes from '../constants/action-types';

export const sendAPIDataToReducer = (data) => {

  return {
    type: actionTypes.SEND_API_DATA_TO_REDUCER,
    data
  };
}