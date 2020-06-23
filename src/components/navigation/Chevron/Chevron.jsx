import React from 'react';
import PropTypes from 'prop-types';
import '../../../stylesheets/Chevron.scss';

const Chevron = ({ onClick, path, visible, direction }) => {
  return (
    <div className="chevron" onClick={onClick} data-direction={direction}>
      {visible && (
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
          <path fill="#6C7680" d={path} />
        </svg>
      )}
    </div>
  );
};

Chevron.propTypes = {
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  direction: PropTypes.string.isRequired,
};

export default Chevron;
