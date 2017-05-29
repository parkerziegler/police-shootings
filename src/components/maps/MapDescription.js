import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'

class MapDescription extends React.Component {

	constructor() {
		super();
	}

	render() {

			return (
				<div className='map-description-container'>
					<div className='header'>Shootings Per Million By State</div>
					<div className='text'>Between January 1, 2015 and July 9, 2016, 1,715people were killed by police in the United States. That amounts to roughly 3.1 people per day. New Mexico had the highest normalized rate of police involved shootings in this time period, with 17.26 for every million residents. Hover over a state to obtain its rate.
					</div>
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
