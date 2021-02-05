import React from 'react';

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

export default Notification;