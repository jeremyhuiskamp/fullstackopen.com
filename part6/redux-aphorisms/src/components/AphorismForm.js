import React from 'react';

import { createAphorism } from '../reducers/aphorismReducer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AphorismForm = ({ createAphorism }) => {
    const submit = (e) => {
        e.preventDefault();
        const content = e.target.elements.newAphorism.value;
        e.target.elements.newAphorism.value = '';
        createAphorism(content);
    };

    return <form onSubmit={submit}>
        <input data-testid='newAphorism' name='newAphorism' />
        <button>create</button>
    </form>;
};

AphorismForm.propTypes = {
    createAphorism: PropTypes.func,
};

export default connect(
    undefined,
    { createAphorism },
)(AphorismForm);