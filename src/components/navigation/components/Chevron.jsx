import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'redux-little-router'

const Chevron = (props) => {

    return (
        <Link href={props.href} className={props.className}>
            <div className='chevron'>
                {props.visible ?
                <svg width="50" height="50" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#6C7680" d={props.path}/>
                </svg> : null}
            </div>
        </Link>
    );
};

Chevron.propTypes = {
    href: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired
};

export default Chevron;
