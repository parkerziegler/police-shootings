// import necessary modules
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { routerForBrowser, initializeCurrentLocation } from 'redux-little-router';
import { mapReducer } from './reducers/mapReducer';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';

const routes = {
  '/parker': {
      title: 'Parker'
  }
};

const {
  reducer,
  middleware,
  enhancer
} = routerForBrowser({
  routes
});

// create our saga middleware - we'll use this handle our side effects
// seamlessly
const sagaMiddleware = createSagaMiddleware();

// create our redux store, applying the saga middleware
const store = createStore(
  combineReducers({ router: reducer, mapReducer }),
  compose(enhancer, applyMiddleware(middleware, sagaMiddleware))
);

// be sure to run the saga middleware
sagaMiddleware.run(rootSaga);

const initialLocation = store.getState().router;
if (initialLocation) {
  console.log(initialLocation);
  store.dispatch(initializeCurrentLocation(initialLocation));
}

// render our App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
