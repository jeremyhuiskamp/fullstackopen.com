import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ notification }) => {
    if (!notification?.msg) {
        return null;
    }

    return <div
        className="notification"
        style={{
            color: notification.isError ? 'red' : 'green',
        }}>
        {notification.msg}
    </div>;
};

Notification.propTypes = {
    notification: PropTypes.shape({
        isError: PropTypes.bool.isRequired,
        msg: PropTypes.string,
    }),
};

export default Notification;