import * as React from "react";
import PropTypes from "prop-types";
import { go } from "redux-little-router";
import "./Chevron.css";

const Chevron = ({ className, onClick, path }) => {
  return (
    <div className="chevron" onClick={onClick}>
      <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path fill="#6C7680" d={path} />
      </svg>
    </div>
  );
};

Chevron.propTypes = {
  path: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Chevron;
