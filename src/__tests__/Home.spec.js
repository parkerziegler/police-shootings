import { store } from '../index';
import Home from '../components/home/Home';

describe('<Home />', () => {
  it('renders without crashing', () => {
    shallow(<Home store={store} />);
  });

  it('matches the Jest snapshot', () => {
    const wrapper = mount(<Home store={store} />);
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });
});
