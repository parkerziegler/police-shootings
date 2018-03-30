import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import moment from 'moment';

import '../../App.css';
import './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.calculateStats = this.calculateStats.bind(this);
    this.createTitles = this.createTitles.bind(this);
  }

  calculateStats() {
    const { maps } = this.props;
    // get the total and average number of shootings per day
    const total = `${maps.shootingsData.length}`;
    const numDays = moment('2016-12-31').diff(moment('2015-01-01'), 'days');
    const average = (maps.shootingsData.length / numDays).toFixed(1);
    return {
      total,
      average,
    };
  }

  createTitles() {
    const { total, average } = this.calculateStats();
    return [
      {
        jsx: (
          <div className="home-text">
            Between January 1, 2015 and December 31, 2016
          </div>
        ),
      },
      {
        jsx: (
          <div className="home-text-large">
            <b>{total}</b> people
          </div>
        ),
      },
      {
        jsx: (
          <div className="home-text">
            were killed by police in the United States.
          </div>
        ),
      },
      {
        jsx: (
          <div className="home-text">
            That amounts to roughly <b className="home-text-large">{average}</b>{' '}
            people per day.
          </div>
        ),
      },
      {
        jsx: <div className="home-text">Here's what we know.</div>,
      },
      {
        jsx: (
          <div
            className="home-text"
            style={{
              fontFamily: 'HelveticaNeue, Helvetica, sans-serif',
              marginTop: '5%',
              fontWeight: 900,
            }}
          >
            An Investigation | By Parker Ziegler
          </div>
        ),
      },
    ];
  }

  render() {
    const items = this.createTitles().map(({ jsx }, i) => {
      return (
        <CSSTransitionGroup
          transitionName={`home-transition-${i}`}
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
          key={i}
        >
          {jsx}
        </CSSTransitionGroup>
      );
    });

    return (
      <div className="page-content" style={{ flexDirection: 'column' }}>
        {items}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
  };
};

export default connect(mapStateToProps)(Home);
