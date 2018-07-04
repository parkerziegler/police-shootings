import { Line } from '../components/graphs/Line/Line';
import mockShootingsByDate from '../__mocks__/mock-shootings-by-date.json';

describe('<Line />', () => {
  const props = {
    maps: {
      shootingsByDate: mockShootingsByDate,
    },
    router: {
      route: '/shootingsbydate',
    },
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<Line {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
