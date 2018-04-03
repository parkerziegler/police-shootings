import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import * as _ from 'lodash';
import moment from 'moment';

class Line extends React.Component {
  render() {
    const { maps } = this.props;

    return (
      <VictoryChart width={1000} height={400} padding={40}>
        <VictoryAxis
          scale="time"
          tickValues={[
            new Date(2015, 3, 1),
            new Date(2015, 9, 1),
            new Date(2016, 2, 1),
            new Date(2016, 8, 1),
          ]}
          tickFormat={t => moment(t).format('MMM YYYY')}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine
          data={maps.shootingsByDate}
          x="date"
          y="count"
          scale="time"
          animate={{
            duration: 20000,
          }}
        />
      </VictoryChart>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
  };
};

export default connect(mapStateToProps)(Line);
