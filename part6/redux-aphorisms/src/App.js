import React, { useEffect } from 'react';
import AphorismList from './components/AphorismList';
import AphorismForm from './components/AphorismForm';
import Notification from './components/Notification';
import Filter from './components/Filter';
import { initAphorisms } from './reducers/aphorismReducer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const App = ({ initAphorisms }) => {
    useEffect(() => {
        initAphorisms();
    }, []);

    return <>
        <h2>Aphorisms</h2>
        <Notification />
        <Filter />
        <AphorismList />
        <h2>Create New</h2>
        <AphorismForm />
    </>;
};

App.propTypes = {
    initAphorisms: PropTypes.func,
};

export default connect(
    undefined,
    { initAphorisms },
)(App);