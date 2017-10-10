import React from 'react';
import { Provider } from 'redux';
import { store } from './index';
import Enzyme, { shallow } from 'enzyme';
import App from './App';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  shallow(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
