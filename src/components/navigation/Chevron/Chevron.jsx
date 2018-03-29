import * as React from "react";
import PropTypes from "prop-types";
import "./Chevron.css";

const Chevron = ({ onClick, path, visible }) => {
  return (
    <div className="chevron" onClick={onClick}>
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
  visible: PropTypes.bool.isRequired
};

export default Chevron;
