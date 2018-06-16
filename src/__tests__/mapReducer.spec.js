import { mapReducer, initialState } from '../reducers/mapReducer';
import * as mapActions from '../actions/mapActions';

describe('mapReducer', () => {
  const mockData = [{ id: '01' }, { id: '02' }];
  it('returns initial state', () => {
    expect(mapReducer(undefined, {})).toEqual(initialState);
  });

  it('updates state in response to CALL_API', () => {
    expect(mapReducer(initialState, mapActions.callAPI())).toEqual({
      ...initialState,
      fetchingData: true,
    });
  });

  it('updates state in response to SEND_API_DATA_TO_REDUCER', () => {
    expect(
      mapReducer(initialState, mapActions.sendAPIDataToReducer(mockData))
    ).toEqual({
      ...initialState,
      geoData: mockData,
      fetchingData: false,
    });
  });

  it('updates state in response to SEND_SHOOTINGS_DATA_TO_REDUCER', () => {
    expect(
      mapReducer(initialState, mapActions.sendShootingsDataToReducer(mockData))
    ).toEqual({
      ...initialState,
      shootingsData: mockData,
    });
  });

  it('updates state in response to SEND_CENSUS_DATA_TO_REDUCER', () => {
    expect(
      mapReducer(initialState, mapActions.sendCensusDataToReducer(mockData))
    ).toEqual({
      ...initialState,
      censusData: mockData,
    });
  });

  it('updates state in response to GET_HOVERED_STATE', () => {
    expect(
      mapReducer(
        initialState,
        mapActions.getHoveredStateData({
          stateName: 'MA',
          shootings: 10,
          shootingsPerMillion: 2.5,
        })
      )
    ).toEqual({
      ...initialState,
      activeState: {
        stateName: 'MA',
        shootings: 10,
        shootingsPerMillion: 2.5,
      },
    });
  });

  it('updates state in response to SEND_SHOOTINGS_BY_DATE_TO_REDUCER', () => {
    expect(
      mapReducer(
        initialState,
        mapActions.sendShootingsByDateToReducer(mockData)
      )
    ).toEqual({
      ...initialState,
      shootingsByDate: mockData,
    });
  });
});
