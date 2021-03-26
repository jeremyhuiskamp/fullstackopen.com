import React from 'react';
import PropTypes from 'prop-types';

const Aphorism = ({ aphorism, vote }) => {
    return <div>
        <p>{aphorism.content}</p>
        <p>
            has {aphorism.votes}&nbsp;
            <button onClick={vote}>vote</button>
        </p>
    </div>;
};

Aphorism.propTypes = {
    aphorism: PropTypes.shape({
        content: PropTypes.string,
        id: PropTypes.string,
        votes: PropTypes.number,
    }),
    vote: PropTypes.func,
};

export default Aphorism;