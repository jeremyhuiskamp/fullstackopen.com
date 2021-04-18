import { combineReducers, createStore } from 'redux';
import { reducer as aphorismReducer } from './reducers/aphorismReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    aphorisms: aphorismReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(),
);

export {
    store,
    reducer,
};