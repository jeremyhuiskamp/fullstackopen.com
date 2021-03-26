import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { reducer } from './reducers/aphorismReducer';
import { Provider } from 'react-redux';
import App from './App';

const store = createStore(reducer);


const renderApp = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>,
        document.getElementById('root'),
    );
};

renderApp();
store.subscribe(renderApp);