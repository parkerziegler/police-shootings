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
} from './constants/descriptions';

// define routes for the application
const routes = {
  '/': {
    title: 'Intro',
    index: 0,
  },
  '/total-shootings': {
    title: 'Total Shootings',
    descTitle: 'Total Shootings',
    descSubtitle: 'By State',
    index: 1,
    hasChildren: true,
    jsx: totalShootingsJSX,
    '/black': {
      title: 'Total Shootings By Race African American',
      descTitle: 'Total Shootings',
      descSubtitle: 'African American',
      childIndex: 0,
      hasNextSibling: true,
      jsx: totalShootingsBlackJSX,
    },
    '/latino': {
      title: 'Total Shootings By Race Latino',
      descTitle: 'Total Shootings',
      descSubtitle: 'Latino',
      childIndex: 1,
      hasNextSibling: true,
      jsx: totalShootingsLatinoJSX,
    },
    '/asian': {
      title: 'Total Shootings By Race Asian',
      descTitle: 'Total Shootings',
      descSubtitle: 'Asian',
      childIndex: 2,
      hasNextSibling: true,
      jsx: totalShootingsAsianJSX,
    },
    '/nativeamerican': {
      title: 'Total Shootings By Race Native American',
      descTitle: 'Total Shootings',
      descSubtitle: 'Native American',
      childIndex: 3,
      hasNextSibling: true,
      jsx: totalShootingsNativeAmericanJSX,
    },
    '/white': {
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
    title: 'Shootings Per Million By State',
    descTitle: 'Shootings Per Million',
    descSubtitle: 'By State',
    index: 2,
    hasChildren: true,
    jsx: shootingsPerCapitaJSX,
    '/black': {
      title: 'Shootings Per Million By Race African American',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'African American',
      childIndex: 0,
      hasNextSibling: true,
      jsx: shootingsPerCapitaBlackJSX,
    },
    '/latino': {
      title: 'Shootings Per Million By Race Latino',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'Latino',
      childIndex: 1,
      hasNextSibling: true,
      jsx: shootingsPerCapitaLatinoJSX,
    },
    '/asian': {
      title: 'Shootings Per Million By Race Asian',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'Asian',
      childIndex: 2,
      hasNextSibling: true,
      jsx: shootingsPerCapitaAsianJSX,
    },
    '/nativeamerican': {
      title: 'Shootings Per Million By Race Native American',
      descTitle: 'Shootings Per Million',
      descSubtitle: 'Native American',
      childIndex: 3,
      hasNextSibling: true,
      jsx: shootingsPerCapitaNativeAmericanJSX,
    },
    '/white': {
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
    title: 'Shootings By Date',
    index: 3,
    isLastRoute: true,
    jsx: shootingsByDayJSX,
  },
};

// create the router
const { reducer, middleware, enhancer } = routerForBrowser({
  routes,
  basename: '/d3-react-map',
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
