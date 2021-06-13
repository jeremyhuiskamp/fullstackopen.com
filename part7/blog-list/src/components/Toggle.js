import React, { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Toggle = forwardRef(({ buttonLabel, children }, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    useImperativeHandle(ref, () => {
        return {
            hide: () => { setVisible(false); },
        };
    });

    return <>
        <div style={hideWhenVisible}>
            <button onClick={() => setVisible(true)}>{buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
            {children}
            <button onClick={() => setVisible(false)}>cancel</button>
        </div>
    </>;
});

Toggle.displayName = 'Toggle';
Toggle.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    children: PropTypes.any,
};

export default Toggle;