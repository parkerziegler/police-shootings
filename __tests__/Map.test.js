import { store } from '../src/index';
import Map from '../src/components/maps/Map/Map';

it('renders without crashing', () => {

    shallow(<Map mapType="choropleth" store={store} />);
});