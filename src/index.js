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
  '/': {
    title: 'Intro',
    index: 0,
    navClass: 'main'
  },
  '/total-shootings': {
    title: 'Total Shootings',
    index: 1,
    navClass: 'main',
    hasChildren: true,
    '/black': {
      title: 'Total Shootings By Race - African American',
      navClass: 'child',
      childIndex: 0,
      hasNextSibling: true
    },
    '/latino': {
      title: 'Total Shootings By Race - Latino',
      navClass: 'child',
      childIndex: 1,
      hasNextSibling: true
    },
    '/white': {
      title: 'Total Shootings By Race - White',
      navClass: 'child',
      childIndex: 2,
      hasNextSibling: false
    }
  },
  '/percapita': {
    title: 'Shootings Per Million By State',
    index: 2,
    navClass: 'main'
  },
  '/shootingsbydate': {
    title: 'Shootings By Date',
    index: 3,
    navClass: 'main',
    isLastRoute: true
  }
};

const {
  reducer,
  middleware,
  enhancer
} = routerForBrowser({
  routes,
  basename: '/d3-react-map'
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

// get the initial location of the router
const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

// render our App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
