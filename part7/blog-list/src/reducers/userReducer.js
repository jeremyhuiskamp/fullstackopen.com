import loginService from '../services/login';
import {
    clearNotification,
    setErrorNotification,
} from '../reducers/notificationReducer';

const reducer = (state = null, action) => {
    switch (action?.type) {
        case 'LOGIN':
            return action.data;
        case 'LOGOUT':
            return null;
    }

    return state;
};

const tryLogin = (username, password) => dispatch => {
    dispatch(clearNotification());
    loginService.login(username, password).then(user => {
        dispatch(loggedIn(user));
    }).catch(e => {
        console.error(e.response?.data?.error ?? e);
        dispatch(setErrorNotification(`login failed: ${e.response?.data?.error}`));
    });
};

const loggedIn = user => ({
    type: 'LOGIN',
    data: user,
});

const logout = () => ({
    type: 'LOGOUT',
});

export {
    reducer,
    tryLogin,
    loggedIn,
    logout,
};