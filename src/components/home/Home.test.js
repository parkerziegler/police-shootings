import React from 'react';
import { store } from '../../index';
import Enzyme, { shallow } from 'enzyme';
import Home from './Home';

it('renders without crashing', () => {
  shallow(
      <Home store={store} />
  );
});

it('renders all expected child divs', () => {

  const wrapper = shallow(<Home store={store} />);

  // example of how to debug output
  console.log(wrapper.debug());
  console.log(wrapper.dive().debug());
  console.log(wrapper.dive().find('.page-content').children().debug());
  
  expect(wrapper.dive().find('.page-content').children()).toHaveLength(6);
});