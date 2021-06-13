const uuid = require('uuid');

const reducer = (state, action) => {
    switch (action?.type) {
        case 'SET_NOTIFICATION':
            return {
                [action.data.level]: action.data.msg,
                clearToken: action.data.clearToken,
            };
        case 'CLEAR_NOTIFICATION':
            if (action.data?.clearToken === undefined || action.data?.clearToken === state?.clearToken) {
                return {};
            }
    }
    return state ?? {};
};

// setNotification creates two actions: one to set the current notification
// message, and one to clear the notification.  The two are linked, so that
// firing the clearing action has no effect if the message has been subsequently
// overwritten.
const setNotification = (msg, level) => {
    const clearToken = uuid.v4();
    const clearAction = clearNotification(clearToken);
    const action = {
        type: 'SET_NOTIFICATION',
        data: {
            level: level,
            msg: msg,
            clearToken: clearToken,
        },
    };

    return { action, clearAction };
};

const clearNotification = clearToken => ({
    type: 'CLEAR_NOTIFICATION',
    data: {
        clearToken,
    },
});

const setExpiringNotification = (msg, level, seconds) => dispatch => {
    const { action, clearAction } = setNotification(msg, level);
    dispatch(action);
    setTimeout(() => dispatch(clearAction), seconds * 1000);
};

const setInfoNotification = (msg, expirationSeconds = 5) =>
    setExpiringNotification(msg, 'info', expirationSeconds);

const setErrorNotification = (msg, expirationSeconds = 5) =>
    setExpiringNotification(msg, 'error', expirationSeconds);

export {
    reducer,
    setInfoNotification,
    setErrorNotification,
    clearNotification,
};