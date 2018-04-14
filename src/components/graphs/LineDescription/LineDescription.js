import React from 'react';
import { connect } from 'react-redux';

import '../../../stylesheets/LineDescription.css';

const LineDescription = ({ title, subtitle, description }) => (
  <div className="line-description-container">
    <div className="line-description-title">
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
    {description}
  </div>
);

const mapStateToProps = state => ({
  title: state.router.result.descTitle,
  subtitle: state.router.result.descSubtitle,
  description: state.router.result.jsx,
});

export default connect(mapStateToProps)(LineDescription);
