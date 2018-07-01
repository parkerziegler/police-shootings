import { Map } from '../components/maps/Map/Map';
import mockGeoData from '../__mocks__/mock-geodata';

describe('<Map />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <Map mapType="choropleth" maps={{ geoData: mockGeoData }} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders proportional circles for states when mapType is propotional', () => {
    const wrapper = shallow(
      <Map mapType="proportional" maps={{ geoData: mockGeoData }} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders the proportional circle legend correctly when all values are beneath the provided threshold', () => {
    const modifiedGeoData = {
      ...mockGeoData,
      objects: {
        ...mockGeoData.objects,
        states: {
          ...mockGeoData.objects.states,
          geometries: mockGeoData.objects.states.geometries.map(g => ({
            properties: {
              ...g.properties,
              numShootings: 1,
            },
          })),
        },
      },
    };

    const wrapper = shallow(
      <Map mapType="proportional" maps={{ geoData: modifiedGeoData }} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
