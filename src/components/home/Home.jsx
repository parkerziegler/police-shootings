import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import moment from 'moment';

import '../../App.css';
import '../../stylesheets/Home.css';

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
      <div className="home-text">
        Between January 1, 2015 and December 31, 2016
      </div>,
      <div className="home-text-large">
        <b>{total}</b> people
      </div>,
      <div className="home-text">
        were killed by police in the United States.
      </div>,
      <div className="home-text">
        That amounts to roughly <b className="home-text-large">{average}</b>{' '}
        people per day.
      </div>,
      <div className="home-text">Here's what we know.</div>,
      <div
        className="home-text"
        style={{
          fontFamily: 'HelveticaNeue, Helvetica, sans-serif',
          marginTop: '5%',
          fontWeight: 900,
        }}
      >
        An Investigation | By Parker Ziegler
      </div>,
    ];
  }

  render() {
    return (
      <div className="page-content" style={{ flexDirection: 'column' }}>
        <TransitionGroup component={null}>
          {this.createTitles().map((title, i) => {
            return (
              <CSSTransition
                key={i}
                appear
                classNames={`home-transition-${i}`}
                timeout={15000}
              >
                {title}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  maps: state.mapReducer,
});

export default connect(mapStateToProps)(Home);
