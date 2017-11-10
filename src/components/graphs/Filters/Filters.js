import React from 'react';
import './Filters.css';
import PropTypes from 'prop-types';

const Filters = (props) => {

    // destructure the props
    const { radios, checkedValue, onChangeHandler, containerClassName } = props;

    let radioButtons = radios.map(({ id, label, className }, i) => {

        let checked = id === checkedValue;

        return (
            <div key={i}>
                <input type="radio" id={id} onChange={onChangeHandler} checked={checked} />
                <label htmlFor={id} className={className}>{label}</label>
            </div>
        );
    });

    return (
        <form className='filter-form'>
            <div className='filter-title'>Apply Filters</div>
            <div className={containerClassName}>
                {radioButtons}
            </div>
        </form>
    );
};

export default Filters;

Filters.propTypes = {
    radios: PropTypes.array.isRequired,
    checkedValue: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired,
    containerClassName: PropTypes.string.isRequired
};

