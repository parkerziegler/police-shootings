import React from 'react';
import './ChartDescription.css';
import { connect } from 'react-redux';

class ChartDescription extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { title, subtitle, router } = this.props;

        return (
            <div className='chart-description-container'>
                <div className='chart-title'>{title}</div>
                <div className='chart-subtitle'>{subtitle}</div>
                <div className='chart-text'>{router.result.jsx}</div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        title: ownProps.title,
        subtitle: ownProps.subtitle,
        router: state.router
    };
};

export default connect(mapStateToProps)(ChartDescription);