import * as React from 'react';
import '../App.css';

class Header extends React.Component {

  render() {

    return (
        <div className='header'>
          <div className='page-title'>Police Involved Shootings in the United States</div>
          <div className='page-title'>January 1, 2015 – December 31, 2016</div>
        </div>
    );
  }
}

export default Header;
