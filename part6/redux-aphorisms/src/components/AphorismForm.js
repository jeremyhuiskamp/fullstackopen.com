import React from 'react';

import { useDispatch } from 'react-redux';
import { createAphorismThunk } from '../reducers/aphorismReducer';

const AphorismForm = () => {
    const dispatch = useDispatch();

    const submit = (e) => {
        e.preventDefault();
        const content = e.target.elements.newAphorism.value;
        e.target.elements.newAphorism.value = '';
        dispatch(createAphorismThunk(content));
    };

    return <form onSubmit={submit}>
        <input data-testid='newAphorism' name='newAphorism' />
        <button>create</button>
    </form>;
};

export default AphorismForm;