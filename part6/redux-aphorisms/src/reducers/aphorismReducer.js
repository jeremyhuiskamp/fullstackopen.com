const uuid = require('uuid');

const asObject = (aphorism) => ({
    content: aphorism,
    id: uuid.v4(),
    votes: 0,
});

const update = (arr, id, f) =>
    arr.map(it => it.id === id ? { ...it, ...f(it) } : it);

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'INIT_APHORISMS':
            return action.data;
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

const initAphorisms = (aphorisms) => {
    return {
        type: 'INIT_APHORISMS',
        data: aphorisms,
    };
};

const createAphorism = (aphorism) => {
    // support either just plain content, in which case we generate an id
    // and default the vote count, or a complete aphorism defined elsewhere:
    if (typeof aphorism === 'string') {
        aphorism = asObject(aphorism);
    }
    return {
        type: 'NEW_APHORISM',
        data: aphorism,
    };
};

const voteForAphorism = (id) => {
    return {
        type: 'VOTE_FOR_APHORISM',
        data: id,
    };
};

module.exports = {
    reducer,
    initAphorisms,
    createAphorism,
    voteForAphorism
};