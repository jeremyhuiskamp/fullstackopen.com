import { combineReducers, createStore } from 'redux';
import { reducer as aphorismReducer } from './reducers/aphorismReducer';
import { reducer as notificationReducer } from './reducers/notificationReducer';
import { reducer as filterReducer } from './reducers/filterReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    aphorisms: aphorismReducer,
    notification: notificationReducer,
    filter: filterReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(),
);

export {
    store,
    reducer,
};