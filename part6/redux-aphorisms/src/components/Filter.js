import React from 'react';

import { useDispatch } from 'react-redux';
import { updateFilter } from '../reducers/filterReducer';

const Filter = () => {
    const dispatch = useDispatch();

    const onChange = e => {
        dispatch(updateFilter(e.target.value));
    };

    return <div>
        filter:&nbsp;<input data-testid='filter' onChange={onChange}></input>
    </div>;
};

export default Filter;