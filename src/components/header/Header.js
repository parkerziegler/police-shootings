import * as React from 'react';
import '../../App.css';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class Header extends React.Component {

  render() {

    // wrap our header in CSS Transition Group - this will slowly fade it in
    return (
			<CSSTransitionGroup
			transitionName="header-transition"
			transitionAppear={true}
			transitionAppearTimeout={500}
			transitionEnter={false}
			transitionLeave={false}>
        <div className='header'>
          <div className='page-title'>Police Involved Shootings in the United States</div>
          <div className='page-title'>January 1, 2015 – December 31, 2016</div>
        </div>
			</CSSTransitionGroup>
    );
  }
}

export default Header;
