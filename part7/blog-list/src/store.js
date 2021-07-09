import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as notificationReducer } from './reducers/notificationReducer';
import { reducer as blogReducer } from './reducers/blogReducer';
import { reducer as userReducer } from './reducers/userReducer';
import { reducer as usersReducer } from './reducers/usersReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk),
    ),
);

export {
    store,
    reducer,
};