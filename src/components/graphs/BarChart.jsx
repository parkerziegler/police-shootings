import * as React from 'react';
import { connect } from 'react-redux';
import { VictoryChart, VictoryBar } from 'victory';
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
        console.log(groupByDate);

        let data = [{
            date: new Date('2017-09-24'), count: 8
        }, {
            date: new Date('2017-09-25'), count: 6
        }, {
            date: new Date('2017-09-26'), count: 4
        }];

        return (
            <VictoryChart>
                <VictoryBar data={data} x="date" y="count" scale="time"/>
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