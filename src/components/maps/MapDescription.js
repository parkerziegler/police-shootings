import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import moment from 'moment';
import * as _ from 'lodash';
import DataTable from './DataTable';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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

		// first calculate how many shootings occurred per day on average
		let totalCount = Number(this.props.maps.shootingsData.length).toLocaleString();
		
		// use moment to get the difference between start and end date
		let numDays = moment("2016-12-31").diff(moment("2015-01-01"), "days");

		// get the average
		let numPerDay = Number(this.props.maps.shootingsData.length / numDays).toFixed(1);

		// also calculate the highest state
		let highestState = this.props.maps.data.objects ?
		_.orderBy(this.props.maps.data.objects.states.geometries, ['properties.shootingsPerCapita'], ['desc']) : null;

		// get the name of the state with the highest rate
		let highestStateName = highestState ? highestState[0].properties.stateName : 'Loading...';

		// get its rate as well
		let highestRate = highestState ? Number(highestState[0].properties.shootingsPerCapita * 1000000).toFixed(1) : 'loading...'

		// finally, get the state that the user is hovering
		let activeState = this.props.maps.activeState ? this.props.maps.activeState : null;

		// put everything in an object to return
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

		// calculate the highest state
		let orderedStates = this.props.maps.data.objects ?
		_.orderBy(this.props.maps.data.objects.states.geometries, ['properties.numShootings'], ['desc']) : null;

		let highestState = orderedStates ? orderedStates[0].properties.stateName : 'loading...';

		let highestCount = orderedStates ? orderedStates[0].properties.numShootings : 'loading...';

		let secondHighest = orderedStates ? orderedStates[1].properties.stateName : 'loading...';

		let thirdHighest = orderedStates ? orderedStates[2].properties.stateName : 'loading...';

		let lowestState = orderedStates ? orderedStates[orderedStates.length - 1].properties.stateName : 'loading...';

		let secondLowest = orderedStates ? orderedStates[orderedStates.length - 2].properties.stateName : 'loading...';

		let proportionalStats = {
			highestState,
			highestCount,
			secondHighest,
			thirdHighest,
			lowestState,
			secondLowest
		};

		return proportionalStats;

	}

	getJSXForChoropleth() {

		let stats = this.getStatsForChoropleth();

		return (
			<div className='text'>
				Between January 1, 2015 and December 31, 2016, <b>{stats.totalCount}</b> people were killed by police in the United States. That amounts to roughly <b>{stats.numPerDay}</b> people per day. <br /><br /><b>{stats.highestStateName}</b> had the highest rate of police involved shootings in this time period, with <b>{stats.highestRate}</b> for every million residents.<br/> <br/>Hover over a state to obtain its rate.
			</div>
		);


	}

	getJSXForProportional() {

		let stats = this.getStatsForProportional();

		return (
			<div className='text'>
				Of all 50 states, <b>{stats.highestState}</b> had the greatest number of shootings in this time period at <b>{stats.highestCount}</b>. <b>{stats.secondHighest}</b> and <b>{stats.thirdHighest}</b> <b>{stats.lowestState}</b> and <b>{stats.secondLowest}</b> had the fewest shootings of all states, with only <b>2</b> each.<br/><br />Hover over a state to obtain the number of shootings.
			</div>
		);
	}

	render() {

		let insetJSX = this.props.mapType === 'choropleth' ? this.getJSXForChoropleth() : this.getJSXForProportional();

			return (
				<CSSTransitionGroup
				transitionName="description-transition"
				transitionAppear={true}
				transitionAppearTimeout={500}
				transitionEnter={false}
				transitionLeave={false}
				component={FirstChild}>
					<div className='map-description-container'>
						<div className='inset-header'>{this.props.insetHeader}</div>
						<div className='inset-subheader'>By State</div>
						{insetJSX}
						<DataTable />
					</div>
				</CSSTransitionGroup>
			);
	}
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(MapDescription);
