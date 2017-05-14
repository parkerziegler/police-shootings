import * as React from 'react'
import '../../App.css'

class State extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <path d={this.props.path}/>;
  }
}

export default State;
