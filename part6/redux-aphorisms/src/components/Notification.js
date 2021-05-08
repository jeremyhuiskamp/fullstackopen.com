import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Notification = ({ notification }) => {
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

Notification.propTypes = {
    notification: PropTypes.shape({
        error: PropTypes.string,
        info: PropTypes.string,
    }),
};

const mapStateToProps = state => ({
    notification: state.notification,
});

export default connect(mapStateToProps)(Notification);