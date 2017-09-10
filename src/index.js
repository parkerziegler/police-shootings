// import necessary modules
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';

// create our saga middleware - we'll use this handle our side effects
// seamlessly
const sagaMiddleware = createSagaMiddleware();

// create our redux store, applying the saga middleware
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// be sure to run the saga middleware
sagaMiddleware.run(rootSaga);

// render our App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
