import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
    const notification = useSelector(state => state.notification);

    const [msg, className] = notification.error !== undefined ?
        [notification.error, 'error'] :
        notification.info !== undefined ?
            [notification.info, 'info'] : [undefined, undefined];
    if (!msg) {
        return <></>;
    }

    const classNames = `notification ${className}`;
    return <div data-testid='notification' className={classNames}>
        {msg}
    </div>;
};

export default Notification;