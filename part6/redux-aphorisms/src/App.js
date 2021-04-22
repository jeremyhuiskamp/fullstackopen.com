import React from 'react';
import AphorismList from './components/AphorismList';
import AphorismForm from './components/AphorismForm';
import Notification from './components/Notification';

const App = () => {
    return <>
        <h2>Aphorisms</h2>
        <Notification />
        <AphorismList />
        <h2>Create New</h2>
        <AphorismForm />
    </>;
};

export default App;