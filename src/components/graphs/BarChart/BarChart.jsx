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

            return { date: _.parseInt(key, 10), count: groupByDate[key].length }
        });

        return (
            <VictoryChart animate={{
                onLoad: {
                    duration: 2000,
                    before: () => ({ opacity: 0, _y: 0 }),
                    after: (datum) => ({ opacity: 1, _y: datum._y })
                }
            }}>
                <VictoryAxis scale="time" tickValues={[new Date(2015, 3, 1), new Date(2015, 9, 1), new Date(2016, 2, 1), new Date(2016, 8, 1)]} tickFormat={(t) => moment(t).format('MMM YYYY')} />
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