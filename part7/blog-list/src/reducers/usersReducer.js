import usersService from '../services/users';
import {
    setErrorNotification,
} from '../reducers/notificationReducer';

const reducer = (state = [], action) => {
    switch (action?.type) {
        case 'USERS_LOADED':
            return [...action.data];
    }
    return state;
};

const refreshUsers = () => dispatch => {
    usersService.getAll().then(users => {
        dispatch({
            type: 'USERS_LOADED',
            data: users,
        });
    }).catch(e => {
        console.error(`failed to fetch initial users: ${e}`);
        dispatch(setErrorNotification('fetching users failed'));
    });
};

export {
    reducer,
    refreshUsers,
};