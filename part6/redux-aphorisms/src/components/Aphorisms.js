import React from 'react';
import Aphorism from './Aphorism';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAphorism } from '../reducers/aphorismReducer';

const Aphorisms = () => {
    const aphorisms = useSelector(state => state);
    const dispatch = useDispatch();

    return <div>
        {aphorisms.map(aphorism =>
            <Aphorism
                key={aphorism.id}
                aphorism={aphorism}
                vote={() => dispatch(voteForAphorism(aphorism.id))} />
        )}
    </div>;
};

export default Aphorisms;