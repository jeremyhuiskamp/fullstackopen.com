const deepFreeze = require('deep-freeze');
const { reducer, setInfoNotification, setErrorNotification, clearNotification } = require('./notificationReducer');

describe('notification reducer', () => {
    // Create a new state and reduce all the given actions to it.
    const playActions = (...actions) => {
        let state = undefined;
        actions.forEach(action => {
            state = reducer(state, action);
            deepFreeze(state);
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
        const newState = playActions(setInfoNotification('info!').action);
        expect(newState.info).toEqual('info!');
        expect(newState.error).not.toBeDefined();
    });

    test('error', () => {
        const newState = playActions(setErrorNotification('error!').action);
        expect(newState.error).toEqual('error!');
        expect(newState.info).not.toBeDefined();
    });

    test('info overwrites error', () => {
        const newState = playActions(
            setErrorNotification('error!').action,
            setInfoNotification('info!').action);
        expect(newState.info).toEqual('info!');
        expect(newState.error).not.toBeDefined();
    });

    test('error overwrites info', () => {
        const newState = playActions(
            setInfoNotification('info!').action,
            setErrorNotification('error!').action);
        expect(newState.error).toEqual('error!');
        expect(newState.info).not.toBeDefined();
    });

    test('unconditional clear', () => {
        const newState = playActions(
            setInfoNotification('info!').action,
            clearNotification());
        expect(newState.info).not.toBeDefined();
        expect(newState.error).not.toBeDefined();
    });

    test('normal clear', () => {
        const { action, clearAction } = setInfoNotification('info!');
        const newState = playActions(
            action,
            clearAction);
        expect(newState.info).not.toBeDefined();
        expect(newState.error).not.toBeDefined();

    });

    test('don\'t clear overwritten notification', () => {
        const {
            action: infoAction,
            clearAction: clearInfoAction,
        } = setInfoNotification('info!');

        const newState = playActions(
            infoAction,
            setErrorNotification('error!').action,
            clearInfoAction,
        );

        expect(newState.error).toEqual('error!');
        expect(newState.info).not.toBeDefined();
    });
});