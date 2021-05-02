const uuid = require('uuid');
import aphorismService from '../services/aphorisms';
import { setErrorNotification } from './notificationReducer';

const asObject = (aphorism) => ({
    content: aphorism,
    id: uuid.v4(),
    votes: 0,
});

const replace = (arr, item) =>
    arr.map(it => it.id === item.id ? item : it);

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'INIT_APHORISMS':
            return action.data;
        case 'NEW_APHORISM':
            return [...state, action.data];
        case 'UPDATE_APHORISM':
            return replace(state, action.data);
    }

    return state;
};

const initAphorisms = () => dispatch => {
    aphorismService.getAll()
        .then(aphorisms =>
            dispatch({
                type: 'INIT_APHORISMS',
                data: aphorisms,
            }))
        .catch(e => {
            console.error(`failed to fetch initial aphorisms: ${e}`);
            const { action, clearAction } = setErrorNotification('fetching aphorisms failed');
            dispatch(action);
            setTimeout(() => dispatch(clearAction), 5000);
        });
};

const aphorismCreated = (aphorism) => {
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

const createAphorism = aphorism => async dispatch => {
    aphorismService.create({
        content: aphorism,
        votes: 0,
    }).then(aphorism =>
        dispatch(aphorismCreated(aphorism))
    ).catch(e => {
        console.error(`failed to create aphorism: ${e}`);
        const { action, clearAction } = setErrorNotification('creating aphorism failed');
        dispatch(action);
        setTimeout(() => dispatch(clearAction), 5000);
    });
};

const voteForAphorism = aphorism => async dispatch => {
    aphorismService.vote(
        aphorism
    ).then(aphorism =>
        dispatch({
            type: 'UPDATE_APHORISM',
            data: aphorism,
        })
    ).catch(e => {
        console.error(`failed to vote for aphorism: ${e}`);
        const { action, clearAction } = setErrorNotification('voting for aphorism failed');
        dispatch(action);
        setTimeout(() => dispatch(clearAction), 5000);
    });
};

export {
    reducer,
    initAphorisms,
    aphorismCreated,
    createAphorism,
    voteForAphorism,
};