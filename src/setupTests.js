import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {createSerializer} from 'enzyme-to-json';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.React = React;

expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));