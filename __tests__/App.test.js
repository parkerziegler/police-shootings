import { store } from '../src/index';
import App from '../src/App';

it('renders without crashing', () => {
  shallow(
      <App store={store} />
  );
});
