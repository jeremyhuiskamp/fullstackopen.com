import React, { useState, useImperativeHandle, forwardRef } from 'react';

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

export default Toggle;