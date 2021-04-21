const deepFreeze = require('deep-freeze');
const { reducer, setInfoNotification, setErrorNotification, clearNotification } = require('./notificationReducer');

describe('notification reducer', () => {
    const playActions = (firstAction, ...subsequentActions) => {
        let state = reducer(undefined, firstAction);
        subsequentActions.forEach(a => {
            deepFreeze(state);
            state = reducer(state, a);
        });
        return state;
    };

    test('initial state', () => {
        const action = {
            type: 'DO_NOTHING',
        };

        const newState = playActions(action);
        expect(newState.info).not.toBeDefined();
        expect(newState.error).not.toBeDefined();
    });

    test('info', () => {
        const newState = playActions(setInfoNotification('info!'));
        expect(newState.info).toEqual('info!');
        expect(newState.error).not.toBeDefined();
    });

    test('error', () => {
        const newState = playActions(setErrorNotification('error!'));
        expect(newState.error).toEqual('error!');
        expect(newState.info).not.toBeDefined();
    });

    test('info overwrites error', () => {
        const newState = playActions(
            setErrorNotification('error!'),
            setInfoNotification('info!'));
        expect(newState.info).toEqual('info!');
        expect(newState.error).not.toBeDefined();
    });

    test('error overwrites info', () => {
        const newState = playActions(
            setInfoNotification('info!'),
            setErrorNotification('error!'));
        expect(newState.error).toEqual('error!');
        expect(newState.info).not.toBeDefined();
    });

    test('clear', () => {
        const newState = playActions(
            setInfoNotification('info!'),
            clearNotification());
        expect(newState.info).not.toBeDefined();
        expect(newState.error).not.toBeDefined();
    });
});