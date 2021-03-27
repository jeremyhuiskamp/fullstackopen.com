import React from 'react';
import Aphorisms from './components/Aphorisms';
import AphorismCreator from './components/AphorismCreator';

const App = () => {
    return <>
        <h2>Aphorisms</h2>
        <Aphorisms />
        <h2>Create New</h2>
        <AphorismCreator />
    </>;
};

export default App;