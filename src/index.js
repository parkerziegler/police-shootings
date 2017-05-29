import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { rootReducer } from './reducers/index';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';

const reducers = combineReducers({ rootReducer });
const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
