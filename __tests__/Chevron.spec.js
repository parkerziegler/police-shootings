import Chevron from '../src/components/navigation/Chevron/Chevron';
import { ChevronUp } from '../src/constants/chevron-paths';

describe('<Chevron />', () => {
  const mock = jest.fn();
  let wrapper;

  afterEach(() => {
    mock.mockReset();
    wrapper.unmount();
  });

  it('matches the snapshot', () => {
    wrapper = mount(<Chevron path={ChevronUp} onClick={mock} visible={true} />);
  });

  it('fires the supplied callback onClick', () => {
    wrapper = mount(<Chevron path={ChevronUp} onClick={mock} visible={true} />);
    wrapper.find('.chevron').simulate('click');
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('does not render <svg> when visible is false', () => {
    wrapper = mount(
      <Chevron path={ChevronUp} onClick={mock} visible={false} />
    );
    expect(wrapper.find('svg')).toHaveLength(0);
  });
});
