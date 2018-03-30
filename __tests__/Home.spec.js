import { store } from '../src/index';
import Home from '../src/components/home/Home';

describe('<Home />', () => {
  it('renders without crashing', () => {
    shallow(<Home store={store} />);
  });

  it('renders all expected child divs', () => {
    const wrapper = shallow(<Home store={store} />);
    expect(
      wrapper
        .dive()
        .find('.page-content')
        .children()
    ).toHaveLength(6);
  });

  it('matches the Jest snapshot', () => {
    const wrapper = mount(<Home store={store} />);
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });
});
