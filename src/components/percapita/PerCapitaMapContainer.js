import * as React from 'react'
import '../../App.css'
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as _ from 'lodash';

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

    let path = d3.geoPath();

    let data = this.state.us ? topojson.feature(this.state.us, this.state.us.objects.states).features : null;

    const featurePath = () => {
        if (data) {
          let pathComponent = _.map(data, (feature, i) => {
            let newPath = path(feature);
            return <path d={newPath} key={i} />;
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

export default PerCapitaMapContainer;
