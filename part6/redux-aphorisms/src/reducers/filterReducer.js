const reducer = (state, action) => {
    switch (action?.type) {
        case 'SET_FILTER':
            return {
                filter: action.data.filter,
            };
    }
    return state ?? {};
};

const updateFilter = filter => ({
    type: 'SET_FILTER',
    data: {
        filter,
    },
});

module.exports = {
    reducer,
    updateFilter,
};