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

const setInfoNotification = msg => setNotification(msg, 'info');

const setErrorNotification = msg => setNotification(msg, 'error');

// setNotification creates two actions: one to set the current notification
// message, and one to clear the notification.  The two are linked, so that
// firing the clearing action has no effect if the message has been subsequently
// overwritten.
//
// TODO: add a function that dispatches the actions, with a timer for the
// clearAction.  Otherwise we repeat this pattern throughout the app.
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

const setExpiringNotifiction = (msg, level, seconds) => dispatch => {
    const { action, clearAction } = setNotification(msg, level);
    dispatch(action);
    setTimeout(() => dispatch(clearAction), seconds * 1000);
};

const setExpiringInfoNotification = (msg, seconds) =>
    setExpiringNotifiction(msg, 'info', seconds);

const setExpiringErrorNotification = (msg, seconds) =>
    setExpiringNotifiction(msg, 'error', seconds);

module.exports = {
    reducer,
    setInfoNotification,
    setExpiringInfoNotification,
    setErrorNotification,
    setExpiringErrorNotification,
    clearNotification,
};