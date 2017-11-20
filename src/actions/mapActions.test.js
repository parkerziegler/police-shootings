import * as actionTypes from '../constants/action-types';
import { callAPI } from './mapActions';

it('fires the callAPI saga', () => {

    const expectedAction = {
        type: actionTypes.CALL_API
    };

    expect(callAPI()).toEqual(expectedAction);
});