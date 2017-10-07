import { all } from 'redux-saga/effects';
import { watchAPICall } from './mapSagas';
import { watchLocationChanged } from './routerSagas';

// export our rootSaga
export default function* rootSaga() {
    yield all([
        watchAPICall(),
        watchLocationChanged()
    ])
}
