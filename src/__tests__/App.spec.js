import { App } from '../App';
import mockRouter from '../__mocks__/mock-router.json';
import { push } from 'redux-little-router';

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

  it('renders null when fetchingData is true', () => {
    const wrapper = shallow(<App {...props} maps={{ fetchingData: true }} />);
    expect(wrapper.type()).toBeNull();
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

  it('handles goToPreviousChild properly when navigating from child to parent', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <App
        {...props}
        router={{
          ...mockRouter,
          result: {
            parent: {
              index: 2,
            },
          },
        }}
        dispatch={dispatch}
      />
    );

    wrapper.instance().goToPreviousChild();
    expect(dispatch).toHaveBeenCalledWith(push('/per-capita'));
  });

  it('handles goToPreviousChild properly on nested routes', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <App
        {...props}
        router={{
          ...mockRouter,
          result: {
            childIndex: 1,
            parent: {
              index: 2,
            },
          },
        }}
        dispatch={dispatch}
      />
    );

    wrapper.instance().goToPreviousChild();
    expect(dispatch).toHaveBeenCalledWith(push('/per-capita/black'));
  });

  it('handles goToNextChild properly when navigating from parent to child', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <App
        {...props}
        router={{
          ...mockRouter,
          result: {
            index: 2,
            hasChildren: true,
          },
        }}
        dispatch={dispatch}
      />
    );

    wrapper.instance().goToNextChild();
    expect(dispatch).toHaveBeenCalledWith(push('/per-capita/black'));
  });

  it('handles goToNextChild properly on nested routes', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <App
        {...props}
        router={{
          ...mockRouter,
          result: {
            childIndex: 0,
            parent: {
              index: 2,
            },
          },
        }}
        dispatch={dispatch}
      />
    );

    wrapper.instance().goToNextChild();
    expect(dispatch).toHaveBeenCalledWith(push('/per-capita/latino'));
  });

  it('handles goToPrevious properly on parent routes', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <App
        {...props}
        router={{
          ...mockRouter,
          result: {
            index: 2,
          },
        }}
        dispatch={dispatch}
      />
    );

    wrapper.instance().goToPrevious();
    expect(dispatch).toHaveBeenCalledWith(push('/total-shootings'));
  });

  it('handles goToNext properly on parent routes', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(
      <App
        {...props}
        router={{
          ...mockRouter,
          result: {
            index: 2,
          },
        }}
        dispatch={dispatch}
      />
    );

    wrapper.instance().goToNext();
    expect(dispatch).toHaveBeenCalledWith(push('/shootings-by-date'));
  });
});
