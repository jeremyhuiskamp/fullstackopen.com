import React from 'react';
import Aphorism from './Aphorism';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAphorism } from '../reducers/aphorismReducer';
import { setInfoNotification } from '../reducers/notificationReducer';

const AphorismList = () => {
    const aphorisms = useSelector(state => state.aphorisms);
    const dispatch = useDispatch();

    const sortedAphorisms = aphorisms.slice().sort((a, b) => b.votes - a.votes);

    const vote = (aphorism) => {
        dispatch(voteForAphorism(aphorism.id));
        const { action, clearAction } = setInfoNotification(`you voted for "${aphorism.content}"`);
        dispatch(action);
        setTimeout(() => dispatch(clearAction), 5000);
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

export default AphorismList;