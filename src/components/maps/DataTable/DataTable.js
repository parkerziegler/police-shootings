import * as React from 'react';
import { connect } from 'react-redux';
import '../../../stylesheets/DataTable.css';
import { round, orderBy } from 'lodash';

class DataTable extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'highest',
      isHoverOnHighest: false,
      isHoverOnLowest: false,
    };
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.getTableNodes = this.getTableNodes.bind(this);

    // a lookup to store names for column headers
    this.styles = {
      choropleth: {
        columnHeader: 'Shootings Per Million',
        active: {
          background: '#4292C6',
          color: '#FFFFFF',
          border: '1px solid #6BAED6',
        },
        inactive: {
          background: '#FFFFFF',
          color: '#4292C6',
          border: '1px solid #4292C6',
        },
      },
      proportional: {
        columnHeader: 'Total Shootings',
        active: {
          background: '#B24739',
          color: '#FFFFFF',
          border: '1px solid 7F3329',
        },
        inactive: {
          background: '#FFFFFF',
          color: '#B24739',
          border: '1px solid #B24739',
        },
      },
    };
  }

  onMouseEnterHandler(event) {
    if (event.target.id === 'highest') {
      this.setState({
        isHoverOnHighest: true,
        isHoverOnLowest: false,
      });
    } else if (event.target.id === 'lowest') {
      this.setState({
        isHoverOnHighest: false,
        isHoverOnLowest: true,
      });
    }
  }

  onMouseLeaveHandler(event) {
    this.setState({
      isHoverOnHighest: false,
      isHoverOnLowest: false,
    });
  }

  onClickHandler(event) {
    this.setState({
      activeTab: event.target.id,
    });
  }

  getTableNodes() {
    const { mapType, maps } = this.props;
    const { activeTab } = this.state;

    // determine whether we should render the table
    // in ascending or descending order
    // hand this off to lodash
    const ascDesc = activeTab === 'highest' ? ['desc'] : ['asc'];

    if (mapType === 'choropleth') {
      // order states by per million count
      const states = orderBy(
        maps.geoData.objects.states.geometries,
        state =>
          state.properties.numShootings / state.properties.population * 1000000,
        ascDesc
      ).slice(0, 5);

      // render divs for both the state name and
      // shootings per capita
      const stateNames = states.map((state, i) => (
        <div className="row" key={i}>
          {state.properties.stateName}
        </div>
      ));

      const stateStats = states.map((state, i) => (
        <div className="row" key={i}>
          {round(
            state.properties.numShootings /
              state.properties.population *
              1000000,
            2
          )}
        </div>
      ));

      // return these in an object to be rendered
      return {
        stateNames,
        stateStats,
      };
    } else if (mapType === 'proportional') {
      // obtain our table data by looking at our reducer
      const states = orderBy(
        maps.geoData.objects.states.geometries,
        ['properties.numShootings'],
        ascDesc
      ).slice(0, 5);

      // next render divs for both the state name and
      // total number of shootings
      const stateNames = states.map((state, i) => (
        <div className="row" key={i}>
          {state.properties.stateName}
        </div>
      ));

      const stateStats = states.map((state, i) => (
        <div className="row" key={i}>
          {state.properties.numShootings}
        </div>
      ));

      // return these in an object to be rendered
      return {
        stateNames,
        stateStats,
      };
    }
  }

  render() {
    const { stateNames, stateStats } = this.getTableNodes();
    const highest =
      this.state.isHoverOnHighest || this.state.activeTab === 'highest'
        ? this.styles[this.props.mapType].active
        : this.styles[this.props.mapType].inactive;

    const lowest =
      this.state.isHoverOnLowest || this.state.activeTab === 'lowest'
        ? this.styles[this.props.mapType].active
        : this.styles[this.props.mapType].inactive;

    return (
      <div className="data-table">
        <div className="table-button-container">
          <div
            className="button"
            id="highest"
            style={highest}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
            onClick={this.onClickHandler}
          >
            Highest
          </div>
          <div
            className="button"
            id="lowest"
            style={lowest}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
            onClick={this.onClickHandler}
          >
            Lowest
          </div>
        </div>
        <div className="table">
          <div>
            <div className="table-header">State</div>
            {stateNames}
          </div>
          <div>
            <div className="table-header">
              {this.styles[this.props.mapType].columnHeader}
            </div>
            {stateStats}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  maps: state.mapReducer,
});

export default connect(mapStateToProps)(DataTable);
