import { DataTable } from '../components/maps/DataTable/DataTable';
import mockGeoData from '../__mocks__/mock-geodata.json';

describe('<DataTable /> component', () => {
  const props = {
    mapType: 'choropleth',
    maps: {
      geoData: mockGeoData,
    },
  };

  it('renders correctly', () => {
    const wrapper = shallow(<DataTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('updates local state on button hover and click', () => {
    const wrapper = shallow(<DataTable {...props} />);
    const node = wrapper.find('#lowest');
    node.simulate('mouseenter', { target: { id: 'lowest' } });
    expect(wrapper.state('isHoverOnLowest')).toBe(true);
    expect(wrapper.state('isHoverOnHighest')).toBe(false);

    node.simulate('click', { target: { id: 'lowest' } });
    expect(wrapper.state('activeTab')).toEqual('lowest');
    node.simulate('mouseleave');
    expect(wrapper.state('isHoverOnLowest')).toBe(false);

    node.simulate('mouseenter', { target: { id: 'highest' } });
    expect(wrapper.state('isHoverOnHighest')).toBe(true);
    expect(wrapper.state('isHoverOnLowest')).toBe(false);

    node.simulate('click', { target: { id: 'highest' } });
    expect(wrapper.state('activeTab')).toEqual('highest');
    node.simulate('mouseleave');
    expect(wrapper.state('isHoverOnHighest')).toBe(false);
  });

  it('renders correctly with mapType proportional', () => {
    const wrapper = shallow(<DataTable {...props} mapType="proportional" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders full markup correctly', () => {
    const wrapper = mount(<DataTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
