import * as action-types from '../constants/action-types';

export const sendAPIDataToReducer = (data) => {

  return {
    type: action-types.SEND_API_DATA_TO_REDUCER,
    data
  }
}
