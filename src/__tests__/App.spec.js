import { App } from '../App';
import mockRouter from '../__mocks__/mock-router.json';

describe('<App />', () => {
  const props = {
    maps: {
      fetchingData: false,
    },
    router: mockRouter,
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<App {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders an empty div when fetchingData is true', () => {
    const wrapper = shallow(<App {...props} maps={{ fetchingData: true }} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('renders correct chevron visibility across all routes', () => {
    const wrapper = shallow(
      <App
        {...props}
        router={{
          result: {
            index: 0,
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({
      router: { result: { isLastRoute: true, parent: true } },
    });
    expect(wrapper).toMatchSnapshot();

    expect(wrapper.instance().getChevronVisibility('random')).toBe(false);
  });
});
