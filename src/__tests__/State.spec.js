import State from '../components/maps/State/State';
import mockState from '../__mocks__/mock-state';
import { store } from '../index';

describe('<State /> component', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <State
        mapType="choropleth"
        stateName={mockState.feature.properties.stateName}
        numShootings={mockState.feature.properties.numShootings}
        population={mockState.feature.properties.population}
        path={mockState.path}
        feature={mockState.feature}
        store={store}
      />
    );

    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  it('fires the onInteractionHandler when a state is hovered on', () => {
    const spy = jest.spyOn(
      State.WrappedComponent.prototype,
      'onInteractionHandler'
    );
    const wrapper = shallow(
      <State
        mapType="choropleth"
        stateName={mockState.feature.properties.stateName}
        numShootings={mockState.feature.properties.numShootings}
        population={mockState.feature.properties.population}
        path={mockState.path}
        feature={mockState.feature}
        store={store}
      />
    );
    const node = wrapper.dive().find('path');

    node.simulate('mouseenter');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('renders the correct svg element based on mapType', () => {
    const wrapperChoropleth = mount(
      <State
        mapType="choropleth"
        stateName={mockState.feature.properties.stateName}
        numShootings={mockState.feature.properties.numShootings}
        population={mockState.feature.properties.population}
        path={mockState.path}
        feature={mockState.feature}
        store={store}
      />
    );

    expect(wrapperChoropleth.find('path')).toHaveLength(1);
    expect(wrapperChoropleth.props().path).toEqual(mockState.path);
    wrapperChoropleth.unmount();

    const wrapperProportional = mount(
      <State
        mapType="proportional"
        stateName={mockState.feature.properties.stateName}
        numShootings={mockState.feature.properties.numShootings}
        population={mockState.feature.properties.population}
        path={mockState.path}
        feature={mockState.feature}
        radius={50}
        store={store}
      />
    );

    expect(wrapperProportional.find('circle')).toHaveLength(1);
    expect(wrapperProportional.props().radius).toEqual(50);
    wrapperProportional.unmount();
  });

  it('should return null if mapType is incorrectly specified', () => {
    const wrapper = shallow(
      <State
        mapType="dot-density"
        stateName={mockState.feature.properties.stateName}
        numShootings={mockState.feature.properties.numShootings}
        population={mockState.feature.properties.population}
        path={mockState.path}
        feature={mockState.feature}
        radius={50}
        store={store}
      />
    ).dive();
    expect(wrapper.type()).toBeNull();
  });
});
