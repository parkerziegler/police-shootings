// import necessary modules
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { routerForBrowser, initializeCurrentLocation } from 'redux-little-router';
import { mapReducer } from './reducers/mapReducer';
import { Provider } from 'react-redux';
import App from './App';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';
import { totalShootingsJSX, totalShootingsBlackJSX, totalShootingsLatinoJSX, totalShootingsAsianJSX, totalShootingsNativeAmericanJSX, totalShootingsWhiteJSX } from './components/maps/MapDescription/Descriptions';

// define routes for the application
const routes = {
  '/': {
    title: 'Intro',
    index: 0
  },
  '/total-shootings': {
    title: 'Total Shootings',
    index: 1,
    hasChildren: true,
    jsx: totalShootingsJSX,
    '/black': {
      title: 'Total Shootings By Race African American',
      childIndex: 0,
      hasNextSibling: true,
      jsx: totalShootingsBlackJSX
    },
    '/latino': {
      title: 'Total Shootings By Race Latino',
      childIndex: 1,
      hasNextSibling: true,
      jsx: totalShootingsLatinoJSX
    },
    '/asian': {
      title: 'Total Shootings By Race Asian',
      childIndex: 2,
      hasNextSibling: true,
      jsx: totalShootingsAsianJSX
    },
    '/nativeamerican': {
      title: 'Total Shootings By Race Native American',
      childIndex: 3,
      hasNextSibling: true,
      jsx: totalShootingsNativeAmericanJSX
    },
    '/white': {
      title: 'Total Shootings By Race White',
      childIndex: 4,
      hasNextSibling: false,
      isLastChildRoute: true,
      jsx: totalShootingsWhiteJSX
    }
  },
  '/percapita': {
    title: 'Shootings Per Million By State',
    index: 2,
    hasChildren: true,
    '/black': {
      title: 'Shootings Per Million By Race African American',
      childIndex: 5,
      hasNextSibling: true    
    },
    '/latino': {
      title: 'Shootings Per Million By Race Latino',
      childIndex: 6,
      hasNextSibling: true
    },
    '/asian': {
      title: 'Shootings Per Million By Race Asian',
      childIndex: 7,
      hasNextSibling: true
    },
    '/nativeamerican': {
      title: 'Shootings Per Million By Race Native American',
      childIndex: 8,
      hasNextSibling: true
    },
    '/white': {
      title: 'Shootings Per Million By Race White',
      childIndex: 9,
      hasNextSibling: false,
      isLastChildRoute: true
    }
  },
  '/shootingsbydate': {
    title: 'Shootings By Date',
    index: 3,
    isLastRoute: true
  }
};

// create the router
const {
  reducer,
  middleware,
  enhancer
} = routerForBrowser({
  routes,
  basename: '/d3-react-map'
});

// create our saga middleware - we'll use this handle our side effects
const sagaMiddleware = createSagaMiddleware();

// create our redux store, applying the router and the saga middleware
export const store = createStore(
  combineReducers({ router: reducer, mapReducer }),
  compose(enhancer, applyMiddleware(middleware, sagaMiddleware))
);

// be sure to run the saga middleware
sagaMiddleware.run(rootSaga);

// get the initial location of the router
const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

// render the App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
