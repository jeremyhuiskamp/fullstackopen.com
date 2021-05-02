const deepFreeze = require('deep-freeze');
const {
    reducer,
    setInfoNotification,
    setExpiringInfoNotification,
    setErrorNotification,
    clearNotification,
} = require('./notificationReducer');

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

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

    describe('expiring notifications', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test('notification is cleared after chosen time', () => {
            const store = createStore(reducer, applyMiddleware(thunk));

            store.dispatch(setExpiringInfoNotification('info!', 2));

            jest.advanceTimersByTime(1000);
            expect(store.getState().info).toEqual('info!');
            expect(store.getState().error).not.toBeDefined();

            jest.advanceTimersByTime(2000);
            expect(store.getState().info).not.toBeDefined();
            expect(store.getState().error).not.toBeDefined();
        });

        test('don\'t clear overwritten notification', () => {
            const store = createStore(reducer, applyMiddleware(thunk));

            store.dispatch(setExpiringInfoNotification('info1', 5));

            jest.advanceTimersByTime(3000); // 3s total
            expect(store.getState().info).toEqual('info1');

            store.dispatch(setExpiringInfoNotification('info2', 5));

            jest.advanceTimersByTime(1000); // 4s total
            expect(store.getState().info).toEqual('info2');

            jest.advanceTimersByTime(2000); // 6s total
            expect(store.getState().info).toEqual('info2');

            jest.advanceTimersByTime(3000); // 9s total
            expect(store.getState().info).not.toBeDefined();
        });
    });
});