import React from 'react';
import Aphorisms from './components/Aphorisms';
import AphorismForm from './components/AphorismForm';

const App = () => {
    return <>
        <h2>Aphorisms</h2>
        <Aphorisms />
        <h2>Create New</h2>
        <AphorismForm />
    </>;
};

export default App;