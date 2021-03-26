import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

const App = () => {
    const dispatcher = (type) => {
        return () => {
            store.dispatch({
                type: type,
            });
        };
    };
    return <>
        <button onClick={dispatcher('GOOD')}>good</button>
        <button onClick={dispatcher('OK')}>neutral</button>
        <button onClick={dispatcher('BAD')}>bad</button>
        <button onClick={dispatcher('ZERO')}>reset stats</button>
        <p>good {store.getState().good}</p>
        <p>neutral {store.getState().ok}</p>
        <p>bad {store.getState().bad}</p>
    </>;
};

const renderApp = () => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root'),
    );
};

renderApp();
store.subscribe(renderApp);