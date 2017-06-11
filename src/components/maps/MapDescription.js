import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import moment from 'moment';
import * as _ from 'lodash';
import DataTable from './DataTable';

class MapDescription extends React.Component {

	render() {

			let totalCount = Number(this.props.maps.shootingsData.length).toLocaleString();

			let numDays = moment("2016-12-31").diff(moment("2015-01-01"), "days");

			let numPerDay = Number(this.props.maps.shootingsData.length / numDays).toFixed(1);

			let highestState = this.props.maps.data.objects ?
					_.orderBy(this.props.maps.data.objects.states.geometries, ['properties.shootingsPerCapita'], ['desc']) : null;

			let highestStateName = highestState ? highestState[0].properties.stateName : 'Loading...';

			let highestRate = highestState ? Number(highestState[0].properties.shootingsPerCapita * 1000000).toFixed(1) : 'loading...'

			let activeState = this.props.maps.activeState ? this.props.maps.activeState : null;

			return (
				<div className='map-description-container'>
					<div className='inset-header'>Shootings Per Million</div>
					<div className='inset-subheader'>By State</div>
					<div className='text'>Between January 1, 2015 and December 31, 2016, <b>{totalCount}</b> people were killed by police in the United States. That amounts to roughly <b>{numPerDay}</b> people per day. <br /><br /><b>{highestStateName}</b> had the highest rate of police involved shootings in this time period, with <b>{highestRate}</b> for every million residents.<br/> <br />Hover over a state to obtain its rate.
					</div>
					<div className='state-name'>{activeState.stateName ? activeState.stateName : 'New Mexico'}</div>
					<div className='inset-subheader'>{activeState.shootingsPerMillion ? _.round(activeState.shootingsPerMillion, 2) : 20.66} shootings per million</div>
					<DataTable />
					{/*<div className='table'>
						<div className='table-row header left'>State</div>
						<div className='table-row header right'>Shootings Per Million</div>
					</div>*/}
				</div>
			)
	}
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(MapDescription);
