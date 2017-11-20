import { store } from '../../../index';
import Map from './Map';

it('renders without crashing', () => {

    shallow(<Map mapType="choropleth" store={store} />);
});