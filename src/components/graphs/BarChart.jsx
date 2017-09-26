import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory';
import * as _ from 'lodash';
import moment from 'moment';

class BarChart extends React.Component {

    render() {

        const { maps } = this.props;

        let dates = _.map(maps.shootingsData, (record) => {
            return moment(`${record.month} - ${record.day} - ${record.year}`, "MMMM - D - YYYY").valueOf();
        });

        let groupByDate = _.groupBy(dates, ((date) => {
            return date;
        }));

        let data = _.map(_.keys(groupByDate), (key) => {

            return { date: key, count: groupByDate[key].length }
        });

        return (
            <VictoryChart>
                <VictoryAxis scale="time" tickCount={5} tickFormat={(t) => new Date(t).getMonth()} />
                <VictoryAxis dependentAxis />
                <VictoryBar data={data.sort()} x="date" y="count" scale="time"/>
            </VictoryChart>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        maps: state.mapReducer
    };
};

export default connect(mapStateToProps)(BarChart);