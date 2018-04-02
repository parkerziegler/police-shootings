import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import * as _ from 'lodash';
import moment from 'moment';

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.maps.shootingsByDate.slice(0, 100),
    };
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    console.log('Time to load more!');
  }

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
          data={this.state.data}
          x="date"
          y="count"
          scale="time"
          animate={{
            duration: 1000,
            onEnd: () => this.loadMore(),
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
