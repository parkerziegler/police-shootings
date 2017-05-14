import * as React from 'react'
import { connect } from 'react-redux';
import '../../App.css'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';
import State from './State';

class PerCapitaMapContainer extends React.Component {

  constructor() {
    super();
    this.state = { us: '' };
  }

  componentDidMount() {

    d3.json("https://d3js.org/us-10m.v1.json", (error, us) => {
      if (error) throw error;
      this.setState({
        us
      });
    });

  }

  render() {

    let geoPath = d3.geoPath();

    let data = this.state.us ? topojson.feature(this.state.us, this.state.us.objects.states).features : null;

    const featurePath = () => {
        if (data) {
          let pathComponent = _.map(data, (feature, i) => {
            let path = geoPath(feature);
            console.log(feature);
            return <State path={path} key={i} />;
          });
          return pathComponent;
        }
    }

    return (
      <svg className='map-container' width="960" height="600">
        {this.state.us !== '' ?
          <g>
            {featurePath()}
          </g> : null
        }
      </svg>
    );
  }
}

function mapStateToProps (state, ownProps) {
  return {
    reducer: state.rootReducer
  }
}

export default connect(mapStateToProps)(PerCapitaMapContainer);
