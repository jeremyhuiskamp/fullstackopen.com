import React from 'react';
import Aphorism from './Aphorism';
import { voteForAphorism } from '../reducers/aphorismReducer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AphorismList = ({ voteForAphorism, aphorisms, filter = '' }) => {
    const filteredAphorisms = aphorisms.filter(a => a.content.includes(filter));
    const sortedAphorisms = filteredAphorisms.slice().sort((a, b) => b.votes - a.votes);

    const vote = (aphorism) => {
        voteForAphorism(aphorism);
    };

    return <div>
        {sortedAphorisms.map(aphorism =>
            <div key={aphorism.id}>
                <hr />
                <Aphorism
                    aphorism={aphorism}
                    vote={() => vote(aphorism)} />
            </div>
        )}
        <hr />
    </div>;
};

AphorismList.propTypes = {
    voteForAphorism: PropTypes.func,
    aphorisms: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.string,
        id: PropTypes.string,
        votes: PropTypes.number,
    })),
    filter: PropTypes.string,
};

export default connect(
    state => ({
        aphorisms: state.aphorisms,
        filter: state.filter?.filter,
    }),
    { voteForAphorism },
)(AphorismList);