import DataTable from '../components/maps/DataTable/DataTable';
import { mockStore } from '../__mocks__/mock-store';

describe('<DataTable /> component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <DataTable mapType="choropleth" store={mockStore} />
    ).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('updates local state on button hover and click', () => {
    const wrapper = shallow(
      <DataTable mapType="choropleth" store={mockStore} />
    ).dive();
    const node = wrapper.find('#lowest');
    node.simulate('mouseenter', { target: { id: 'lowest' } });
    expect(wrapper.state('isHoverOnLowest')).toBe(true);
    expect(wrapper.state('isHoverOnHighest')).toBe(false);

    node.simulate('click', { target: { id: 'lowest' } });
    expect(wrapper.state('activeTab')).toEqual('lowest');
    node.simulate('mouseleave');
    expect(wrapper.state('isHoverOnLowest')).toBe(false);
  });
});
