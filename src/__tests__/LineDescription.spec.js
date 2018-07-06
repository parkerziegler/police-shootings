import { LineDescription } from '../components/graphs/LineDescription/LineDescription';

describe('<LineDescription />', () => {
  const props = {
    title: 'Title',
    subtitle: 'Subtitle',
    description: 'Description',
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<LineDescription {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
