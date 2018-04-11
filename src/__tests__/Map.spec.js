import { store } from '../index';
import Map from '../components/maps/Map/Map';

describe('<Map />', () => {
  it('renders without crashing', () => {
    shallow(<Map mapType="choropleth" store={store} />);
  });

  it('correctly reads the mapType prop', () => {
    const wrapper = shallow(<Map mapType="choropleth" store={store} />);
    expect(wrapper.props().mapType).toEqual('choropleth');
  });
});
