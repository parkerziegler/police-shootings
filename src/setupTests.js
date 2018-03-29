import React from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createSerializer } from "enzyme-to-json";

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.React = React;
