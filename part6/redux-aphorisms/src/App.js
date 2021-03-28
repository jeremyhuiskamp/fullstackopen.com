import React from 'react';
import AphorismList from './components/AphorismList';
import AphorismForm from './components/AphorismForm';

const App = () => {
    return <>
        <h2>Aphorisms</h2>
        <AphorismList />
        <h2>Create New</h2>
        <AphorismForm />
    </>;
};

export default App;