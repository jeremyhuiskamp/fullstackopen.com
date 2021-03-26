import React from 'react';
import Aphorisms from './components/Aphorisms';

const App = () => {
    return <>
        <h2>Aphorisms</h2>
        <Aphorisms />
        <h2>Create New</h2>
        <form>
            <input />
            <button>create</button>
        </form>
    </>;
};

export default App;