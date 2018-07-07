import Chevron from '../components/navigation/Chevron/Chevron';
import { ChevronUp } from '../constants/chevron-paths';

describe('<Chevron />', () => {
  const mock = jest.fn();
  let wrapper;

  afterEach(() => {
    mock.mockReset();
    wrapper.unmount();
  });

  it('matches the snapshot', () => {
    wrapper = mount(
      <Chevron path={ChevronUp} onClick={mock} visible={true} direction="up" />
    );
  });

  it('fires the supplied callback onClick', () => {
    wrapper = mount(
      <Chevron path={ChevronUp} onClick={mock} visible={true} direction="up" />
    );
    wrapper.find('.chevron').simulate('click');
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('does not render <svg> when visible is false', () => {
    wrapper = mount(
      <Chevron path={ChevronUp} onClick={mock} visible={false} direction="up" />
    );
    expect(wrapper.find('svg')).toHaveLength(0);
  });

  it('renders the proper data-direction attribute', () => {
    wrapper = mount(
      <Chevron path={ChevronUp} onClick={mock} visible={true} direction="up" />
    );
    expect(wrapper.find('[data-direction="up"]')).toHaveLength(1);
  });
});
