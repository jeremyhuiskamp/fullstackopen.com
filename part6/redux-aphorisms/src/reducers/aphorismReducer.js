const uuid = require('uuid');

const aphorismsAtStart = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

const asObject = (aphorism) => ({
    content: aphorism,
    id: uuid.v4(),
    votes: 0,
});

const initialState = aphorismsAtStart.map(asObject);

const update = (arr, id, f) =>
    arr.map(it => it.id === id ? { ...it, ...f(it) } : it);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_APHORISM':
            return [...state, action.data];
        case 'VOTE_FOR_APHORISM': {
            const id = action.data;
            return update(state, id, aphorism => ({
                votes: aphorism.votes + 1,
            }));
        }
    }
    return state;
};

const createAphorism = (aphorism) => {
    return {
        type: 'NEW_APHORISM',
        data: asObject(aphorism),
    };
};

const voteForAphorism = (id) => {
    return {
        type: 'VOTE_FOR_APHORISM',
        data: id,
    };
};

module.exports = { reducer, createAphorism, voteForAphorism };