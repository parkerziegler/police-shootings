import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import * as _ from 'lodash';
import moment from 'moment';

class Line extends React.Component {
  render() {
    const { maps } = this.props;

    return (
      <VictoryChart
        width={1000}
        height={400}
        padding={40}
        domainPadding={{ y: 20 }}
      >
        <VictoryAxis
          scale="time"
          tickValues={[
            new Date(2014, 12, 1),
            new Date(2015, 2, 1),
            new Date(2015, 5, 1),
            new Date(2015, 8, 1),
            new Date(2015, 11, 1),
          ]}
          tickFormat={t => moment(t).format('MMMM')}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine
          data={maps.shootingsByDate[0]}
          scale="time"
          style={{
            data: {
              stroke: '#7B52A1',
            },
          }}
          animate={{
            onEnter: {
              duration: 2000,
            },
          }}
        />
        <VictoryLine
          data={maps.shootingsByDate[1]}
          scale="time"
          style={{
            data: {
              stroke: '#9FA152',
            },
          }}
          animate={{
            duration: 2000,
            delay: 1000,
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
