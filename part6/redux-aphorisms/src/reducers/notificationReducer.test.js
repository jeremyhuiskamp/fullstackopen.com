const {
    reducer,
    setInfoNotification,
    setErrorNotification,
    clearNotification,
} = require('./notificationReducer');

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

describe('notification reducer', () => {
    // Create a new state and reduce all the given actions to it.
    const playActions = (...actions) => {
        const store = createStore(reducer, applyMiddleware(thunk));
        actions.forEach(action => {
            store.dispatch(action);
        });
        return store.getState();
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

    test('unconditional clear', () => {
        const newState = playActions(
            setInfoNotification('info!'),
            clearNotification());
        expect(newState.info).not.toBeDefined();
        expect(newState.error).not.toBeDefined();
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

            store.dispatch(setInfoNotification('info!', 2));

            jest.advanceTimersByTime(1000);
            expect(store.getState().info).toEqual('info!');
            expect(store.getState().error).not.toBeDefined();

            jest.advanceTimersByTime(2000);
            expect(store.getState().info).not.toBeDefined();
            expect(store.getState().error).not.toBeDefined();
        });

        test('don\'t clear overwritten notification', () => {
            const store = createStore(reducer, applyMiddleware(thunk));

            store.dispatch(setInfoNotification('info1', 5));

            jest.advanceTimersByTime(3000); // 3s total
            expect(store.getState().info).toEqual('info1');

            store.dispatch(setInfoNotification('info2', 5));

            jest.advanceTimersByTime(1000); // 4s total
            expect(store.getState().info).toEqual('info2');

            jest.advanceTimersByTime(2000); // 6s total
            expect(store.getState().info).toEqual('info2');

            jest.advanceTimersByTime(3000); // 9s total
            expect(store.getState().info).not.toBeDefined();
        });
    });
});