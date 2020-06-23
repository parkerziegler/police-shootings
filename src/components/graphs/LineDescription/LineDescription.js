import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../../../stylesheets/LineDescription.scss';

export const LineDescription = ({ title, subtitle, description }) => (
  <TransitionGroup component={null}>
    <CSSTransition
      appear
      classNames="line-description-transition"
      timeout={3000}
    >
      <div className="line-description-container">
        <div className="line-description-title">
          <div className="title">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
        {description}
      </div>
    </CSSTransition>
  </TransitionGroup>
);

LineDescription.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  title: state.router.result.descTitle,
  subtitle: state.router.result.descSubtitle,
  description: state.router.result.jsx,
});

export default connect(mapStateToProps)(LineDescription);
