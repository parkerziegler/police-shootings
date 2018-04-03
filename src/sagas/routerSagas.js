import { put, takeLatest, select } from 'redux-saga/effects';
import * as _ from 'lodash';
import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names';
import moment from 'moment';

// define a watcher saga to listen for when ROUTER_LOCATION_CHANGED is dispatched by the router
export function* watchLocationChanged() {
  yield takeLatest('ROUTER_LOCATION_CHANGED', handleLocationChanged);
}

// a lookup defining which filters to apply on the data when a particular
// route is hit
const shootingsFilters = {
  '/': { filterKey: null, filterValue: null, populationValue: 'population' },
  '/total-shootings': {
    filterKey: null,
    filterValue: null,
    populationValue: 'population',
  },
  '/total-shootings/black': {
    filterKey: 'raceethnicity',
    filterValue: 'Black',
    populationValue: 'population',
  },
  '/total-shootings/latino': {
    filterKey: 'raceethnicity',
    filterValue: 'Hispanic/Latino',
    populationValue: 'population',
  },
  '/total-shootings/asian': {
    filterKey: 'raceethnicity',
    filterValue: 'Asian/Pacific Islander',
    populationValue: 'population',
  },
  '/total-shootings/nativeamerican': {
    filterKey: 'raceethnicity',
    filterValue: 'Native American',
    populationValue: 'population',
  },
  '/total-shootings/white': {
    filterKey: 'raceethnicity',
    filterValue: 'White',
    populationValue: 'population',
  },
  '/percapita': {
    filterKey: null,
    filterValue: null,
    populationValue: 'populationTotal',
  },
  '/percapita/black': {
    filterKey: 'raceethnicity',
    filterValue: 'Black',
    populationValue: 'populationBlack',
  },
  '/percapita/latino': {
    filterKey: 'raceethnicity',
    filterValue: 'Hispanic/Latino',
    populationValue: 'populationHispanic',
  },
  '/percapita/asian': {
    filterKey: 'raceethnicity',
    filterValue: 'Asian/Pacific Islander',
    populationValue: 'populationAsian',
  },
  '/percapita/nativeamerican': {
    filterKey: 'raceethnicity',
    filterValue: 'Native American',
    populationValue: 'populationAIAN',
  },
  '/percapita/white': {
    filterKey: 'raceethnicity',
    filterValue: 'White',
    populationValue: 'populationWhite',
  },
  '/shootingsbydate': {
    filterKey: null,
    filterValue: null,
    populationValue: 'population',
  },
};

// a function for filtering the shootings data
// filters the data given a key and a value for that key
const filterShootingsData = (data, filterKey = null, filterValue = null) => {
  const clone = [...data];
  if (filterKey && filterValue) {
    return clone.filter(entry => entry[filterKey] === filterValue);
  }
  return clone;
};

// a function for joining the shootingsData and geoData together
// this function gets run on route change, recomposing
// our topojson object in place
const joinShootingsDataToGeoData = (
  shootingsData,
  geoData,
  populationFilter
) => {
  if (!geoData) {
    return;
  }

  const dataByState = _.groupBy(shootingsData, 'state');
  geoData.objects.states.geometries.map(state => {
    // parse the id as an int so we can join it to the state data lookup we have
    // stored in constants
    state.id = parseInt(state.id, 10);
    const matchState = stateNames.find(({ id }) => id === state.id);

    // once we have a match state, use it to obtain
    // the number of shootings and population value for the filter
    const matchShootings = dataByState[matchState.code];
    const numShootings = matchShootings ? matchShootings.length : 0;
    const population = state.properties[populationFilter];

    // finally, recompose the object
    state.properties = {
      ...state.properties,
      numShootings,
      population,
    };
  });

  return geoData;
};

// function for generating proper topojson data based on route and filtes
const handleMapRoutes = (route, shootingsData, geoData) => {
  // obtain the proper data filter based on the route
  const { filterKey, filterValue, populationValue } = shootingsFilters[route];

  // filter the shootings data
  const filteredData = filterShootingsData(
    shootingsData,
    filterKey,
    filterValue
  );

  // join it to the topojson data
  return joinShootingsDataToGeoData(filteredData, geoData, populationValue);
};

const getAllDatesInRange = (startDate, endDate) => {
  const dateArray = [];
  while (
    moment(startDate, 'MM/DD/YYYY').isSameOrBefore(
      moment(endDate, 'MM/DD/YYYY')
    )
  ) {
    dateArray.push(moment(startDate, 'MM/DD/YYYY').valueOf());
    startDate = moment(startDate, 'MM/DD/YYYY').add(1, 'day');
  }
  return dateArray;
};

// function for generating the datasets for the year line graph
const handleDateRoutes = shootingsData => {
  // group shootings by month and year and return as two collections to redux
  const shootingsByDate = shootingsData.map(shooting => {
    return {
      month: shooting.month,
      year: shooting.year,
    };
  });

  // partition the data based on year
  const shootingsByYear = _.partition(
    shootingsByDate,
    shooting => shooting.year === 2015
  );

  // group by month within each year
  const groupByMonth = shootingsByYear.map(year => {
    return _.groupBy(year, ({ month, year }) =>
      moment(`${month} - 2015`, 'MMMM - YYYY').valueOf()
    );
  });

  const data = groupByMonth.map(year => {
    return Object.keys(year).map(month => ({
      x: parseInt(month, 10),
      y: year[month].length,
    }));
  });
  return data;
};

// our generator function to run our handleLocationChanged saga
function* handleLocationChanged(action) {
  try {
    // read the shootings data from the redux store
    const reduxStore = yield select();
    const shootingsData = reduxStore.mapReducer.shootingsData;
    const geoData = reduxStore.mapReducer.geoData;
    const router = reduxStore.router;

    // check if this route is map-based
    if (
      router.routes[action.payload.route].index === 1 ||
      router.routes[action.payload.route].index === 2 ||
      (router.routes[action.payload.route].childIndex >= 0 &&
        router.routes[action.payload.route].childIndex <= 4)
    ) {
      const data = handleMapRoutes(
        action.payload.route,
        shootingsData,
        geoData
      );

      // send this data to redux so our Map component can read from it
      yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data });
    }

    // check if this is the line graph
    if (router.routes[action.payload.route].index === 3) {
      const shootingsByDate = handleDateRoutes(shootingsData);

      yield put({
        type: actionTypes.SEND_SHOOTINGS_BY_DATE_TO_REDUCER,
        shootingsByDate,
      });
    }
  } catch (error) {
    // log any errors
    console.log(error);
  }
}
