import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

const App = () => {
    const good = () => {
        store.dispatch({
            type: 'GOOD',
        });
    };
    return <>
        <button onClick={good}>good</button>
        <button>neutral</button>
        <button>bad</button>
        <button>reset stats</button>
        <p>good {store.getState().good}</p>
        <p>neutral</p>
        <p>bad</p>
    </>;
};

const renderApp = () => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
};

renderApp();
store.subscribe(renderApp);