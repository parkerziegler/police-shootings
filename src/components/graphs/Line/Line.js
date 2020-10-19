import * as React from 'react';
import { connect } from 'react-redux';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryAnimation,
} from 'victory';
import moment from 'moment';

export class Line extends React.Component {
  constructor(props) {
    super(props);
    this.LabelPositionMap = {
      '/shootingsbydate': {
        2015: 230,
        2016: 295,
      },
      '/shootingsbydate/black': {
        2015: 200,
        2016: 325,
      },
      '/shootingsbydate/latino': {
        2015: 100,
        2016: 250,
      },
      '/shootingsbydate/asian': {
        2015: 15,
        2016: 205,
      },
      '/shootingsbydate/nativeamerican': {
        2015: 340,
        2016: 205,
      },
      '/shootingsbydate/white': {
        2015: 280,
        2016: 210,
      },
    };
    this.DelayMap = {
      '/shootingsbydate': 2000,
      '/shootingsbydate/black': 0,
      '/shootingsbydate/latino': 0,
      '/shootingsbydate/asian': 0,
      '/shootingsbydate/nativeamerican': 0,
      '/shootingsbydate/white': 0,
    };
  }
  render() {
    const {
      maps: { shootingsByDate },
      router,
    } = this.props;
    const [stats2015, stats2016] = shootingsByDate;
    const labelPosition = this.LabelPositionMap[router.route];
    const delay = this.DelayMap[router.route];
    return (
      <VictoryChart
        width={1000}
        height={400}
        padding={{ top: 0, bottom: 60, left: 80, right: 60 }}
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
          tickFormat={(t) => moment(t).format('MMMM')}
          label="Month"
          style={{
            axisLabel: {
              fontFamily: "'HelveticaNeue', 'Helvetica', sans-serif",
              fontWeight: 'bold',
              fontSize: '16px',
              padding: 40,
            },
            tickLabels: {
              fontFamily: "'HelveticaNeue', 'Helvetica', sans-serif",
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => parseInt(t, 10)}
          label="Number of Shootings"
          axisLabel
          style={{
            axisLabel: {
              fontFamily: "'HelveticaNeue', 'Helvetica', sans-serif",
              fontWeight: 'bold',
              fontSize: '16px',
              padding: 50,
            },
            tickLabels: {
              fontFamily: "'HelveticaNeue', 'Helvetica', sans-serif",
            },
          }}
        />
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
          delay={delay}
        >
          {(style) => (
            <VictoryLabel
              x={950}
              y={labelPosition ? labelPosition['2015'] : 240}
              text="2015"
              style={style}
            />
          )}
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
            onEnter: {
              duration: 2000,
            },
          }}
        />
        <VictoryAnimation
          data={[{ fill: 'transparent' }, { fill: '#9FA152' }]}
          delay={delay}
        >
          {(style) => (
            <VictoryLabel
              x={950}
              y={labelPosition ? labelPosition['2016'] : 325}
              text="2016"
              style={style}
            />
          )}
        </VictoryAnimation>
      </VictoryChart>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
    router: state.router,
  };
};

export default connect(mapStateToProps)(Line);
