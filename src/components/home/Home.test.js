import React from 'react';
import { store } from '../../index';
import Enzyme, { shallow } from 'enzyme';
import Home from './Home';

it('renders without crashing', () => {
  shallow(
      <Home store={store} />
  );
});