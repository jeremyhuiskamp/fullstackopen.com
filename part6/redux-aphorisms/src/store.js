import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
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
    composeWithDevTools(
        applyMiddleware(thunk),
    ),
);

export {
    store,
    reducer,
};