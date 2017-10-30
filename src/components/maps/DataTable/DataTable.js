import * as React from 'react'
import { connect } from 'react-redux';
import './DataTable.css';
import * as _ from 'lodash';

class DataTable extends React.Component {

	constructor() {
		super();
		this.state = { activeTab: 'highest', isHoverOnHighest: false, isHoverOnLowest: false };
		this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
		this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
		this.getTableJSX = this.getTableJSX.bind(this);
	}

	onMouseEnterHandler(event) {

		if (event.target.id === 'highest') {
			this.setState({
				...this.state,
				isHoverOnHighest: true,
				isHoverOnLowest: false
			});
		} else if (event.target.id === 'lowest') {
			this.setState({
				...this.state,
				isHoverOnHighest: false,
				isHoverOnLowest: true
			});
		} else {
			return;
		}
	}

	onMouseLeaveHandler(event) {

			this.setState({
				...this.state,
				isHoverOnHighest: false,
				isHoverOnLowest: false
			});
	}

	onClickHandler(event) {
		if (event.target.id === 'highest') {
			this.setState({
				...this.state,
				activeTab: 'highest'
			});
		} else if (event.target.id === 'lowest') {
			this.setState({
				...this.state,
				activeTab: 'lowest'
			});
		} else {
			return;
		}
	}

	getTableJSX() {

		// destructure props and state
		const { mapType, maps } = this.props;
		const { activeTab } = this.state;

		// determine whether we should render the table
		// in ascending or descending order - we'll
		// hand this off to lodash
		let ascDesc = activeTab === 'highest' ? ['desc'] : ['asc'];

		if (mapType === 'choropleth') {

			// obtain our table data by looking at our reducer
			let states = _.slice(_.orderBy(maps.geoData.objects.states.geometries, (state) => {
				return state.properties.numShootings / state.properties.population * 1000000;
			}, ascDesc), 0, 5);

			// next render divs for both the state name and
			// shootings per capita
			let stateNames = _.map(states, (state, i) => {
				return <div className='row' key={i}>{state.properties.stateName}</div>;
			});

			let stateStats = _.map(states, (state, i) => {
				return <div className='row' key={i}>{_.round(state.properties.numShootings / state.properties.population * 1000000, 2)}</div>;
			});

			// return these in an object to be rendered
			let tableRow = {
				stateNames,
				stateStats
			};

			return tableRow;

		} else if (mapType === 'proportional') {

			// obtain our table data by looking at our reducer
			let states = _.slice(_.orderBy(maps.geoData.objects.states.geometries, ['properties.numShootings'], ascDesc), 0, 5);
			
			// next render divs for both the state name and
			// total number of shootings
			let stateNames = _.map(states, (state, i) => {
				return <div className='row' key={i}>{state.properties.stateName}</div>;
			});

			let stateStats = _.map(states, (state, i) => {
				return <div className='row' key={i}>{state.properties.numShootings}</div>;
			});

			// return these in an object to be rendered
			let tableRow = {
				stateNames,
				stateStats
			};

			return tableRow;
				
		} else {
			return;
		}
	}

	render() {

		let tableJSX = this.getTableJSX();

		// a lookup to store names for column headers
		let renderProps = {
			'choropleth': {
				columnHeader: 'Shootings Per Million',
				active: {background: '#4292C6', color: '#FFFFFF', border: '1px solid #6BAED6'},
				inactive: {background: '#FFFFFF', color: '#4292C6', border: '1px solid #4292C6'}
			},
			'proportional': {
				columnHeader: 'Total Shootings',
				active: {background: '#B24739', color: '#FFFFFF', border: '1px solid 7F3329'},
				inactive: {background: '#FFFFFF', color: '#B24739', border: '1px solid #B24739'}
			}
		};

		let highest = this.state.isHoverOnHighest || this.state.activeTab === 'highest' ? renderProps[this.props.mapType].active : renderProps[this.props.mapType].inactive;
		
		let lowest = this.state.isHoverOnLowest || this.state.activeTab === 'lowest' ? renderProps[this.props.mapType].active : renderProps[this.props.mapType].inactive;

		return (
			<div className='data-table'>
				<div className='table-button-container'>
					<div className='button' id='highest' style={highest} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} onClick={this.onClickHandler}>Highest</div>
					<div className='button' id='lowest' style={lowest} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}
					onClick={this.onClickHandler}>Lowest</div>
				</div>
				<div className='table'>
					<div>
						<div className='table-header'>State</div>
						{tableJSX.stateNames}
					</div>
					<div>
						<div className='table-header'>{renderProps[this.props.mapType].columnHeader}</div>
						{tableJSX.stateStats}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.mapReducer
  }
}

export default connect(mapStateToProps)(DataTable);
