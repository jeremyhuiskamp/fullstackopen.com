import React from 'react';
import Aphorism from './Aphorism';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAphorism } from '../reducers/aphorismReducer';

const AphorismList = () => {
    const aphorisms = useSelector(state => state.aphorisms);
    const dispatch = useDispatch();

    const sortedAphorisms = aphorisms.slice().sort((a, b) => b.votes - a.votes);

    return <div>
        {sortedAphorisms.map(aphorism =>
            <div key={aphorism.id}>
                <hr />
                <Aphorism
                    aphorism={aphorism}
                    vote={() => dispatch(voteForAphorism(aphorism.id))} />
            </div>
        )}
        <hr />
    </div>;
};

export default AphorismList;