import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AphorismList from './components/AphorismList';
import AphorismForm from './components/AphorismForm';
import Notification from './components/Notification';
import Filter from './components/Filter';
import aphorismService from './services/aphorisms';
import { initAphorisms } from './reducers/aphorismReducer';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        aphorismService.getAll().then(aphorisms =>
            dispatch(initAphorisms(aphorisms)));
    }, [dispatch]);

    return <>
        <h2>Aphorisms</h2>
        <Notification />
        <Filter />
        <AphorismList />
        <h2>Create New</h2>
        <AphorismForm />
    </>;
};

export default App;