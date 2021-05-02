import React from 'react';
import Aphorism from './Aphorism';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAphorism } from '../reducers/aphorismReducer';
import { setInfoNotification } from '../reducers/notificationReducer';

const AphorismList = () => {
    const { aphorisms, filter = '' } = useSelector(
        ({ aphorisms, filter: { filter } }) => ({
            aphorisms, filter,
        }));
    const dispatch = useDispatch();

    const filteredAphorisms = aphorisms.filter(a => a.content.includes(filter));
    const sortedAphorisms = filteredAphorisms.slice().sort((a, b) => b.votes - a.votes);

    const vote = (aphorism) => {
        dispatch(voteForAphorism(aphorism));
        // TODO: push notification down into the voting action:
        dispatch(setInfoNotification(`you voted for "${aphorism.content}"`));
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