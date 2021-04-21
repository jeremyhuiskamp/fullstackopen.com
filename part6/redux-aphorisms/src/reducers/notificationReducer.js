const reducer = (state, action) => {
    switch (action?.type) {
        case 'SET_NOTIFICATION':
            return {
                [action.data.level]: action.data.msg,
            };
        case 'CLEAR_NOTIFICATION':
            return {};
    }
    return state ?? {};
};

const setInfoNotification = msg => ({
    type: 'SET_NOTIFICATION',
    data: {
        level: 'info',
        msg: msg,
    }
});

const setErrorNotification = msg => ({
    type: 'SET_NOTIFICATION',
    data: {
        level: 'error',
        msg: msg,
    }
});

const clearNotification = () => ({
    type: 'CLEAR_NOTIFICATION',
    // TODO: some token to allow us to detect and ignore clearings that have
    // been delayed and superceded?
});

module.exports = { reducer, setInfoNotification, setErrorNotification, clearNotification };