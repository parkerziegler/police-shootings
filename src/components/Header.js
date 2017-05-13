import * as React from 'react';
import '../App.css';

class Header extends React.Component {

  render() {

    let subtitleStyle = {left: 630, color: '#A1A1A1'};

    return (
        <div className='header'>
          <div className='page-title'>Police Involved Shootings in the United States</div>
          <div className='page-title' style={subtitleStyle}>January 1, 2015 – December 31, 2016</div>
        </div>
    );
  }
}

export default Header;
