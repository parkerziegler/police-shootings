import MapDescription from '../components/maps/MapDescription/MapDescription';
import DataTable from '../components/maps/DataTable/DataTable';
import { store } from '../index';

describe('<MapDescription />', () => {
  it('renders properly', () => {
    const wrapper = shallow(
      <MapDescription mapType="choropleth" store={store} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders initialState properly', () => {
    const wrapper = shallow(
      <MapDescription mapType="choropleth" store={store} />
    ).dive();
    expect(wrapper.find('.state-name').text()).toEqual('New Mexico');

    const subheaders = wrapper.find('.inset-subheader');
    expect(subheaders.first().text()).toEqual('');
    expect(subheaders.last().text()).toEqual('20.66 shootings per million');
    expect(wrapper.find(DataTable)).toHaveLength(1);
  });

  it('renders different statistics based on the mapType', () => {
    const wrapper = shallow(
      <MapDescription mapType="proportional" store={store} />
    ).dive();
    expect(wrapper.find('.state-name').text()).toEqual('New Mexico');

    const subheaders = wrapper.find('.inset-subheader');
    expect(subheaders.first().text()).toEqual('');
    expect(subheaders.last().text()).toEqual('43 shootings');
    expect(wrapper.find(DataTable)).toHaveLength(1);
  });
});
