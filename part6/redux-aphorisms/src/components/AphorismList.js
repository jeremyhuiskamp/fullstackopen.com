import React from 'react';
import Aphorism from './Aphorism';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAphorism } from '../reducers/aphorismReducer';

const AphorismList = () => {
    const aphorisms = useSelector(state => state);
    const dispatch = useDispatch();

    const sortedAphorisms = aphorisms.slice().sort((a, b) => b.votes - a.votes);

    return <div>
        {sortedAphorisms.map(aphorism =>
            <Aphorism
                key={aphorism.id}
                aphorism={aphorism}
                vote={() => dispatch(voteForAphorism(aphorism.id))} />
        )}
    </div>;
};

export default AphorismList;