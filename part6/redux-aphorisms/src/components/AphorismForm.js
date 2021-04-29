import React from 'react';

import { useDispatch } from 'react-redux';
import { createAphorism } from '../reducers/aphorismReducer';
import aphorismService from '../services/aphorisms';

const AphorismForm = () => {
    const dispatch = useDispatch();

    const submit = (e) => {
        e.preventDefault();
        const content = e.target.elements.newAphorism.value;
        e.target.elements.newAphorism.value = '';
        aphorismService.create({
            content,
            votes: 0,
        }).then(data => {
            dispatch(createAphorism(data));
        });
    };

    return <form onSubmit={submit}>
        <input data-testid='newAphorism' name='newAphorism' />
        <button>create</button>
    </form>;
};

export default AphorismForm;