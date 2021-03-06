import { put, takeLatest, select } from 'redux-saga/effects';
import { groupBy, partition, findKey, unionBy } from 'lodash';
import * as d3 from 'd3';
import parse from 'date-fns/parse';

import * as actionTypes from '../constants/action-types';
import * as stateNames from '../assets/state-names.json';

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
  '/per-capita': {
    filterKey: null,
    filterValue: null,
    populationValue: 'populationTotal',
  },
  '/per-capita/black': {
    filterKey: 'raceethnicity',
    filterValue: 'Black',
    populationValue: 'populationBlack',
  },
  '/per-capita/latino': {
    filterKey: 'raceethnicity',
    filterValue: 'Hispanic/Latino',
    populationValue: 'populationHispanic',
  },
  '/per-capita/asian': {
    filterKey: 'raceethnicity',
    filterValue: 'Asian/Pacific Islander',
    populationValue: 'populationAsian',
  },
  '/per-capita/nativeamerican': {
    filterKey: 'raceethnicity',
    filterValue: 'Native American',
    populationValue: 'populationAIAN',
  },
  '/per-capita/white': {
    filterKey: 'raceethnicity',
    filterValue: 'White',
    populationValue: 'populationWhite',
  },
  '/shootings-by-date': {
    filterKey: null,
    filterValue: null,
    populationValue: 'population',
  },
  '/shootings-by-date/black': {
    filterKey: 'raceethnicity',
    filterValue: 'Black',
    populationValue: 'populationBlack',
  },
  '/shootings-by-date/latino': {
    filterKey: 'raceethnicity',
    filterValue: 'Hispanic/Latino',
    populationValue: 'populationHispanic',
  },
  '/shootings-by-date/asian': {
    filterKey: 'raceethnicity',
    filterValue: 'Asian/Pacific Islander',
    populationValue: 'populationAsian',
  },
  '/shootings-by-date/nativeamerican': {
    filterKey: 'raceethnicity',
    filterValue: 'Native American',
    populationValue: 'populationAIAN',
  },
  '/shootings-by-date/white': {
    filterKey: 'raceethnicity',
    filterValue: 'White',
    populationValue: 'populationWhite',
  },
};

// a function for filtering the shootings data
// filters the data given a key and a value for that key
const filterShootingsData = (data, filterKey = null, filterValue = null) => {
  const clone = [...data];
  if (filterKey && filterValue) {
    return clone.filter((entry) => entry[filterKey] === filterValue);
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
    return [];
  }

  const dataByState = groupBy(shootingsData, 'state');
  geoData.objects.states.geometries.forEach((state) => {
    // parse the id as an int so it can join to the state data
    // stored in constants
    state.id = parseInt(state.id, 10);
    const matchId = findKey(stateNames.default, ({ id }) => id === state.id);
    const matchState = stateNames.default[matchId];

    // once a match state is found, use it to obtain
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

// function for generating proper topojson data based on route and filters
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

// function for generating the datasets for the parallel year line graph
const handleDateRoutes = (route, shootingsData) => {
  // filter the shootings data based on route
  const { filterKey, filterValue } = shootingsFilters[route];
  const filteredData = filterShootingsData(
    shootingsData,
    filterKey,
    filterValue
  );
  // group shootings by month and year and return as two collections to redux
  const shootingsByDate = filteredData.map((shooting) => {
    return {
      month: shooting.month,
      year: shooting.year,
    };
  });

  // partition the data based on year
  const shootingsByYear = partition(
    shootingsByDate,
    (shooting) => shooting.year === 2015
  );

  // group by month within each year
  const groupByMonth = shootingsByYear.map((year) => {
    return groupBy(year, ({ month }) => {
      // To display data on roughly the same month timescale, just use 2015
      // as the base year
      return parse(`${month} - 2015`, 'MMMM - yyyy', new Date()).valueOf();
    });
  });

  const data = groupByMonth.map((year) => {
    return Object.keys(year).map((month) => ({
      x: parseInt(month, 10),
      y: year[month].length || 0,
    }));
  });

  // Handle months where no shootings occured to prevent holes
  const emptyMonths = d3.timeMonth
    .range(new Date(2015, 0, 1), new Date(2016, 0, 1))
    .map((date) => ({ x: date.valueOf(), y: 0 }));

  const [data2015, data2016] = data;

  return [
    unionBy(data2015, emptyMonths, 'x'),
    unionBy(data2016, emptyMonths, 'x'),
  ];
};

// our generator function to run our handleLocationChanged saga
export function* handleLocationChanged(action) {
  try {
    // read the shootings data from the redux store
    const { shootingsData, geoData } = yield select(
      (state) => state.mapReducer
    );
    const router = yield select((state) => state.router);
    // check if this route is map-based
    if (router.routes[action.payload.route].type === 'map') {
      const data = handleMapRoutes(
        action.payload.route,
        shootingsData,
        geoData
      );

      // send this data to redux so our Map component can read from it
      yield put({ type: actionTypes.SEND_API_DATA_TO_REDUCER, data });
    }
    // check if this is the line graph
    if (router.routes[action.payload.route].type === 'line') {
      const shootingsByDate = handleDateRoutes(
        action.payload.route,
        shootingsData
      );

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
