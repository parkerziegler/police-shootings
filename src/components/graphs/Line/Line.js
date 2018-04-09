import * as React from 'react';
import { connect } from 'react-redux';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryAnimation,
} from 'victory';
import * as _ from 'lodash';
import moment from 'moment';

class Line extends React.Component {
  render() {
    const { maps: { shootingsByDate } } = this.props;
    const [stats2015, stats2016] = shootingsByDate;

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
          data={stats2015}
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
        <VictoryAnimation
          data={[{ fill: 'transparent' }, { fill: '#7B52A1' }]}
          delay={2000}
        >
          {style => <VictoryLabel x={950} y={240} text="2015" style={style} />}
        </VictoryAnimation>
        <VictoryLine
          data={stats2016}
          scale="time"
          style={{
            data: {
              stroke: '#9FA152',
            },
          }}
          animate={{
            duration: 2000,
            delay: 2000,
          }}
        />
        <VictoryAnimation
          data={[{ fill: 'transparent' }, { fill: '#9FA152' }]}
          delay={4000}
        >
          {style => <VictoryLabel x={950} y={325} text="2016" style={style} />}
        </VictoryAnimation>
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
