import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory';
import * as _ from 'lodash';
import moment from 'moment';

class BarChart extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { data } = this.props;
        console.log(data);

        return (
            <VictoryChart width={1200} height={400}>
                <VictoryAxis scale="time" tickValues={[new Date(2015, 3, 1), new Date(2015, 9, 1), new Date(2016, 2, 1), new Date(2016, 8, 1)]} tickFormat={(t) => moment(t).format('MMM YYYY')} />
                <VictoryAxis dependentAxis />
                <VictoryBar data={data.sort()} x="date" y="count" scale="time" animate={{
                    onLoad: {
                        duration: 2000,
                        easing: "linear",
                        before: () => ({ opacity: 0.3, _y: 0 }),
                        after: (datum) => ({ opacity: 1, _y: datum._y })
                    }
                }} style={{ data: { fill: (datum) => datum.color } }}/>
            </VictoryChart>
        );
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        maps: state.mapReducer,
        data: ownProps.data
    };
};

export default connect(mapStateToProps)(BarChart);