import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as notificationReducer } from './reducers/notificationReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    notification: notificationReducer,
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