import React from 'react';
import './ChartDescription.css';
import { connect } from 'react-redux';

class ChartDescription extends React.Component {

    render() {

        const { title, subtitle, maps } = this.props;

        let numDays = maps.temporalFilter !== "100" ? maps.shootingsByDate.filter(({ count }) => count <= Number(maps.temporalFilter) && count > 0).length : maps.shootingsByDate.filter(({ count }) => count > 0).length;

        let percentDays = numDays / 731 * 100;

        return (
            <div className='chart-description-container'>
                <div className='chart-title-container'>
                    <div className='chart-title'>{title}</div>
                    <div className='chart-subtitle'>{subtitle}</div>
                </div>
                <div className='chart-title-container' style={{textAlign: 'right'}}>
                    <div className='chart-title'>{numDays} | {`${percentDays.toFixed(1)}%`}</div>
                    <div className='chart-subtitle'>Num. Days | % Days</div>
                    <div className='chart-subtitle annotate'>with {maps.temporalFilter !== '100' ? `${maps.temporalFilter} or Fewer Shootings` : 'At Least One Shooting'}</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        title: ownProps.title,
        subtitle: ownProps.subtitle,
        maps: state.mapReducer
    };
};

export default connect(mapStateToProps)(ChartDescription);