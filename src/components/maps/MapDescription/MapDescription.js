import * as React from 'react'
import { connect } from 'react-redux';
import './MapDescription.css';
import moment from 'moment';
import * as _ from 'lodash';
import DataTable from '../DataTable/DataTable';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import PropTypes from 'prop-types';

const FirstChild = (props) => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};

class MapDescription extends React.Component {

	constructor(props) {
		super(props);
		this.getStatsForChoropleth = this.getStatsForChoropleth.bind(this);
		this.getStatsForProportional = this.getStatsForProportional.bind(this);
		this.getJSXForChoropleth = this.getJSXForChoropleth.bind(this);
		this.getJSXForProportional = this.getJSXForProportional.bind(this);
	}

	getStatsForChoropleth() {

		const { maps } = this.props;

		// first calculate how many shootings occurred per day on average
		let totalCount = Number(maps.shootingsData.length).toLocaleString();
		
		// use moment to get the total number of days in the dataset
		let numDays = moment("2016-12-31").diff(moment("2015-01-01"), "days");

		// get the average number of shootings per data
		let numPerDay = Number(maps.shootingsData.length / numDays).toFixed(1);

		// also determine which state had the highest rate of shootings
		let orderedStates = _.orderBy(maps.geoData.objects.states.geometries, ['properties.shootingsPerCapita'], ['desc']);

		// get the name of the state with the highest rate
		let highestStateName = orderedStates[0].properties.stateName;

		// and the value
		let highestRate = Number(orderedStates[0].properties.shootingsPerCapita * 1000000).toFixed(1);

		// finally, get the state that the user is hovering
		let activeState = maps.activeState;

		// put the statistics in an object to return
		let choroplethStats = {
			totalCount,
			numPerDay,
			highestStateName,
			highestRate,
			activeState
		};

		return choroplethStats;

	}

	getStatsForProportional() {

		const { maps } = this.props;

		// calculate the highest state
		let orderedStates = _.orderBy(maps.geoData.objects.states.geometries, ['properties.numShootings'], ['desc']);

		// calculate the highest states, the lowest states, and their counts
		let highestState = orderedStates[0].properties.stateName;
		let highestCount = orderedStates[0].properties.numShootings;
		let secondHighest = orderedStates[1].properties.stateName;
		let secondHighestCount = orderedStates[1].properties.numShootings;
		let thirdHighest = orderedStates[2].properties.stateName;
		let thirdHighestCount = orderedStates[2].properties.numShootings;
		let lowestState = orderedStates[orderedStates.length - 1].properties.stateName;
		let lowestCount = orderedStates[orderedStates.length - 1].properties.numShootings;
		let secondLowest = orderedStates[orderedStates.length - 2].properties.stateName;

		// return it all in an object
		let proportionalStats = {
			highestState,
			highestCount,
			secondHighest,
			secondHighestCount,
			thirdHighest,
			thirdHighestCount,
			lowestState,
			lowestCount,
			secondLowest
		};

		return proportionalStats;

	}

	getJSXForChoropleth() {

		// return different text descriptions for the different map types
		// get the appropriate stats for the corresponding map type
		let stats = this.getStatsForChoropleth();

		return (
			<div className='text'>
				Between January 1, 2015 and December 31, 2016, <b>{stats.totalCount}</b> people were killed by police in the United States. That amounts to roughly <b>{stats.numPerDay}</b> people per day. <br /><br /><b>{stats.highestStateName}</b> had the highest rate of police involved shootings in this time period, with <b>{stats.highestRate}</b> for every million residents.<br/> <br/>Hover over a state to obtain its rate.
			</div>
		);


	}

	getJSXForProportional() {

		// return different text descriptions for the different map types
		// get the appropriate stats for the corresponding map type
		let stats = this.getStatsForProportional();

		return (
			<div className='text'>
				Of all 50 states, <b>{stats.highestState}</b> had the greatest number of shootings in this time period at <b>{stats.highestCount}</b>. <b>{stats.secondHighest}</b> and <b>{stats.thirdHighest}</b> had the second and third greatest counts at <b>{stats.secondHighestCount}</b> and <b>{stats.thirdHighestCount}</b>, respectively. <b>{stats.lowestState}</b> had the fewest shootings of all states with <b>{stats.lowestCount}</b>.<br/><br />Hover over a state to obtain the number of shootings.
			</div>
		);
	}

	render() {

		const { mapType, insetHeader, maps } = this.props;

		const children = () => {
			switch (mapType) {
				case 'choropleth':
					return {
						text: this.getJSXForChoropleth(),
						stat: <div className='inset-subheader'>{Number(maps.activeState.shootingsPerMillion).toFixed(2) + " shootings per million"}</div>
					};
				case 'proportional':
					return {
						text: this.getJSXForProportional(),
						stat: <div className='inset-subheader'>{maps.activeState.shootings + " shootings"}</div>
					};
				default:
					return;
			}
		};

		return (
			<CSSTransitionGroup
			transitionName="description-transition"
			transitionAppear={true}
			transitionAppearTimeout={500}
			transitionEnter={false}
			transitionLeave={false}
			component={FirstChild}>
				<div className='map-description-container'>
					<div className='inset-header'>{insetHeader}</div>
					<div className='inset-subheader'>By State</div>
					{children().text}
					<div className='state-name'>{maps.activeState.stateName}</div>
					{children().stat}
					<DataTable mapType={mapType}/>
				</div>
			</CSSTransitionGroup>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
  return {
	maps: state.mapReducer,
	insetHeader: ownProps.insetHeader,
	mapType: ownProps.mapType
  };
};

export default connect(mapStateToProps)(MapDescription);

MapDescription.propTypes = {
	insetHeader: PropTypes.string.isRequired,
	mapType: PropTypes.string.isRequired
};
