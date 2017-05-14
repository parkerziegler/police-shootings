import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { rootReducer } from './reducers/index';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';

const store = createStore(rootReducer);
console.log(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
