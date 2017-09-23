import * as React from 'react';
import { connect } from 'react-redux';
import '../../App.css';
import './Home.css';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import moment from 'moment';

class Home extends React.Component {

    render() {

        const { maps } = this.props;
        
        // first calculate how many shootings occurred per day on average
        let totalCount = Number(maps.shootingsData.length).toLocaleString();
        
        // use moment to get the total number of days in the dataset
        let numDays = moment("2016-12-31").diff(moment("2015-01-01"), "days");

        // get the average number of shootings per data
        let numPerDay = Number(maps.shootingsData.length / numDays).toFixed(1);

        return (
                <div className='page-content' style={{flexDirection: 'column'}}>
                    <CSSTransitionGroup
                    transitionName="header-transition"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                        <div className='home-text'>Between January 1, 2015 and December 31, 2016,</div>
                    </CSSTransitionGroup>
                    <CSSTransitionGroup
                    transitionName="header-transition"
                    transitionAppear={true}
                    transitionAppearTimeout={2000}
                    transitionEnter={false}
                    transitionLeave={false}>
                        <div className='home-text' style={{fontSize: 36}}><b>{totalCount}</b></div>
                    </CSSTransitionGroup>
                    <CSSTransitionGroup
                    transitionName="header-transition"
                    transitionAppear={true}
                    transitionAppearTimeout={3500}
                    transitionEnter={false}
                    transitionLeave={false}>
                        <div className='home-text'>people were killed by police in the United States.</div>
                    </CSSTransitionGroup>
                    <CSSTransitionGroup
                    transitionName="header-transition"
                    transitionAppear={true}
                    transitionAppearTimeout={5000}
                    transitionEnter={false}
                    transitionLeave={false}>
                        <div className='home-text'>That amounts to roughly <b>{numPerDay}</b> people per day.</div>
                    </CSSTransitionGroup>
                </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer
  };
};

export default connect(mapStateToProps)(Home);
