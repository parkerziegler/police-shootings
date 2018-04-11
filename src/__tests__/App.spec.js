import { store } from '../index';
import App from '../App';

it('renders without crashing', () => {
  shallow(<App store={store} />);
});
