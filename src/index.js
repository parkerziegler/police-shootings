// import necessary modules
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { routerForBrowser } from 'redux-little-router';

import { mapReducer } from './reducers/mapReducer';
import { Provider } from 'react-redux';
import App from './App';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';
import { callAPI } from './actions/mapActions';
import {
  totalShootingsJSX,
  totalShootingsBlackJSX,
  totalShootingsLatinoJSX,
  totalShootingsAsianJSX,
  totalShootingsNativeAmericanJSX,
  totalShootingsWhiteJSX,
  shootingsPerCapitaJSX,
  shootingsPerCapitaBlackJSX,
  shootingsPerCapitaLatinoJSX,
  shootingsPerCapitaAsianJSX,
  shootingsPerCapitaNativeAmericanJSX,
  shootingsPerCapitaWhiteJSX,
  shootingsByDayJSX,
  shootingsByDayBlackJSX,
  shootingsByDayLatinoJSX,
  shootingsByDayAsianJsx,
  shootingsByDayNativeAmericanJsx,
  shootingsByDayWhiteJSX,
} from './constants/descriptions';

// define routes for the application
const routes = {
  '/': {
    title: 'Intro',
    index: 0,
  },
  '/total-shootings': {
    type: 'map',
    title: 'Total Shootings',
    descTitle: 'Total Shootings',
    descSubtitle: 'By State',
    index: 1,
    hasChildren: true,
    jsx: totalShootingsJSX,
    '/black': {
      type: 'map',
      title: 'Total Shootings By Race African American',
      descTitle: 'Total Shootings',
      descSubtitle: 'African American',
      childIndex: 0,
      hasNextSibling: true,
      jsx: totalShootingsBlackJSX,
    },
    '/latino': {
      type: 'map',
      title: 'Total Shootings By Race Latino',
      descTitle: 'Total Shootings',
      descSubtitle: 'Latino',
      childIndex: 1,
      hasNextSibling: true,
      jsx: totalShootingsLatinoJSX,
    },
    '/asian': {
      type: 'map',
      title: 'Total Shootings By Race Asian',
      descTitle: 'Total Shootings',
      descSubtitle: 'Asian',
      childIndex: 2,
      hasNextSibling: true,
      jsx: totalShootingsAsianJSX,
    },
    '/nativeamerican': {
      type: 'map',
      title: 'Total Shootings By Race Native American',
      descTitle: 'Total Shootings',
      descSubtitle: 'Native American',
      childIndex: 3,
      hasNextSibling: true,
      jsx: totalShootingsNativeAmericanJSX,
    },
    '/white': {
      type: 'map',
      title: 'Total Shootings By Race White',
      descTitle: 'Total Shootings',
      descSubtitle: 'White',
      childIndex: 4,
      hasNextSibling: false,
      isLastChildRoute: true,
      jsx: totalShootingsWhiteJSX,
    },
  },
  '/percapita': {
    type: 'map',
    title: 'Shootings Per Million By State',
    descTitle: 'Shootings Per Million',
    descSubtitle: 'By State',
    index: 2,
    hasChildren: true,
    jsx: shootingsPerCapitaJSX,
    '/black': {
      type: 'map',
      title: 'Shootings Per Million By Race African American',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'African American',
      childIndex: 0,
      hasNextSibling: true,
      jsx: shootingsPerCapitaBlackJSX,
    },
    '/latino': {
      type: 'map',
      title: 'Shootings Per Million By Race Latino',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'Latino',
      childIndex: 1,
      hasNextSibling: true,
      jsx: shootingsPerCapitaLatinoJSX,
    },
    '/asian': {
      type: 'map',
      title: 'Shootings Per Million By Race Asian',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'Asian',
      childIndex: 2,
      hasNextSibling: true,
      jsx: shootingsPerCapitaAsianJSX,
    },
    '/nativeamerican': {
      type: 'map',
      title: 'Shootings Per Million By Race Native American',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'Native American',
      childIndex: 3,
      hasNextSibling: true,
      jsx: shootingsPerCapitaNativeAmericanJSX,
    },
    '/white': {
      type: 'map',
      title: 'Shootings Per Million By Race White',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'White',
      childIndex: 4,
      hasNextSibling: false,
      isLastChildRoute: true,
      jsx: shootingsPerCapitaWhiteJSX,
    },
  },
  '/shootingsbydate': {
    type: 'line',
    title: 'Shootings By Date',
    descTitle: 'Total Shootings By Date',
    index: 3,
    isLastRoute: true,
    jsx: shootingsByDayJSX,
    hasChildren: true,
    '/black': {
      type: 'line',
      title: 'Shootings By Date By Race African American',
      descTitle: 'Total Shootings By Date',
      descSubtitle: 'African American',
      childIndex: 0,
      hasNextSibling: true,
      jsx: shootingsByDayBlackJSX,
    },
    '/latino': {
      type: 'line',
      title: 'Shootings By Date By Race Latino',
      descTitle: 'Total Shootings By Date',
      descSubtitle: 'Latino',
      childIndex: 1,
      hasNextSibling: true,
      jsx: shootingsByDayLatinoJSX,
    },
    '/asian': {
      type: 'line',
      title: 'Shootings By Date By Race Asian',
      descTitle: 'Total Shootings By Date',
      descSubtitle: 'Asian',
      childIndex: 2,
      hasNextSibling: true,
      jsx: shootingsByDayAsianJsx,
    },
    '/nativeamerican': {
      type: 'line',
      title: 'Shootings By Date By Race Native American',
      descTitle: 'Total Shootings By Date',
      descSubtitle: 'Native American',
      childIndex: 3,
      hasNextSibling: true,
      jsx: shootingsByDayNativeAmericanJsx,
    },
    '/white': {
      type: 'line',
      title: 'Shootings By Date By Race White',
      descTitle: 'Total Shootings By Date',
      descSubtitle: 'White',
      childIndex: 4,
      hasNextSibling: false,
      isLastChildRoute: true,
      jsx: shootingsByDayWhiteJSX,
    },
  },
};

// create the router
const { reducer, middleware, enhancer } = routerForBrowser({
  routes,
  basename: '/police-shootings',
});

// create our saga middleware - we'll use this handle our side effects
const sagaMiddleware = createSagaMiddleware();

// create our redux store, applying the router and the saga middleware
export const store = createStore(
  combineReducers({ router: reducer, mapReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(enhancer, applyMiddleware(middleware, sagaMiddleware))
);

// be sure to run the saga middleware
sagaMiddleware.run(rootSaga);

// get the initial location of the router
store.dispatch(callAPI());

// render the App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') || document.createElement('div')
);
