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

        // iterate over our home page text, applying a transition to each
        let divs = [{
            jsx: <div className='home-text'>Between January 1, 2015 and December 31, 2016</div>
        }, {
            jsx: <div className='home-text-large'><b>{totalCount}</b> people</div>
        }, {
            jsx: <div className='home-text'>were killed by police in the United States.</div>
        }, {
            jsx: <div className='home-text'>That amounts to roughly <b className='home-text-large'>{numPerDay}</b> people per day.</div>
        }, {
            jsx: <div className='home-text'>Here's what we know.</div>
        }, {
            jsx: <div className='home-text' style={{fontFamily: 'HelveticaNeue, Helvetica, sans-serif', marginTop: '5%', fontWeight: 900}}>An Investigation | By Parker Ziegler</div>
        }];

        let items = divs.map((div, i) => {
            return (<CSSTransitionGroup
            transitionName={`home-transition-${i}`}
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
            key={i}>
                {div.jsx}
            </CSSTransitionGroup>);
        });

        return (
            <div className='page-content' style={{flexDirection: 'column'}}>
                {items}
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
