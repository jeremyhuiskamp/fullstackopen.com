import React from 'react';
import { updateFilter } from '../reducers/filterReducer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Filter = ({ updateFilter }) => {
    const onChange = e => {
        updateFilter(e.target.value);
    };

    return <div>
        filter:&nbsp;<input data-testid='filter' onChange={onChange}></input>
    </div>;
};

Filter.propTypes = {
    updateFilter: PropTypes.func,
};

export default connect(
    undefined,
    { updateFilter },
)(Filter);