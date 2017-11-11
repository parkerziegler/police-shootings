import React from 'react';
import { store } from './index';
import Enzyme, { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  shallow(
      <App store={store} />
  );
});
