import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import * as _ from 'lodash';

class DataTable extends React.Component {

	constructor() {
		super();
		this.state = { activeTab: 'highest', isHoverOnHighest: false, isHoverOnLowest: false };
		this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
		this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
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

	render() {

		let active = {background: '#4292C6', color: '#FFFFFF', border: '1px solid #6BAED6'};
		let inactive = {background: '#FFFFFF', color: '#4292C6', border: '1px solid #4292C6'};

		let highest = this.state.isHoverOnHighest || this.state.activeTab === 'highest' ? active : inactive;
		let lowest = this.state.isHoverOnLowest || this.state.activeTab === 'lowest' ? active : inactive;

		let ascDesc = this.state.activeTab === 'highest' ? ['desc'] : ['asc'];

		let states = this.props.maps.data.objects ?
				_.slice(_.orderBy(this.props.maps.data.objects.states.geometries, ['properties.shootingsPerCapita'], ascDesc), 0, 5) : null;

		let stateNames = _.map(states, (state, i) => {
			return <div className='row' key={i}>{state.properties.stateName}</div>;
		});

		let shootingsPerMillion = _.map(states, (state, i) => {
			return <div className='row' key={i}>{_.round(state.properties.shootingsPerCapita * 1000000, 2)}</div>;
		});

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
						{stateNames}
					</div>
					<div>
						<div className='table-header'>Shootings Per Million</div>
						{shootingsPerMillion}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps (state, ownProps) {
  return {
    maps: state.rootReducer
  }
}

export default connect(mapStateToProps)(DataTable);
