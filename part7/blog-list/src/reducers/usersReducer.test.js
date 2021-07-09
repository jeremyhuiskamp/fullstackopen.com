const {
    reducer,
    refreshUsers,
} = require('./usersReducer');
import { reducer as fullReducer } from '../store';
import usersService from '../services/users';
jest.mock('../services/users');

const deepFreeze = require('deep-freeze');
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/dom';

describe('users reducer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });

    test('initial state should be empty', () => {
        const newState = reducer(undefined, undefined);

        expect(newState).toHaveLength(0);
    });

    describe('initialisation', () => {
        let store;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
        });

        test('success', async () => {
            const users = [{
                'blogs': [],
                'id': '1',
                'name': 'root',
                'username': 'root'
            },
            {
                'blogs': [{
                    id: '1',
                    title: 'title1',
                }],
                id: '2',
                name: 'user',
                username: 'User',
            }];
            deepFreeze(users);
            usersService.getAll.mockResolvedValue(users);

            store.dispatch(refreshUsers());

            await waitFor(() => {
                expect(store.getState().users.map(user => user.name)).toEqual([
                    'root',
                    'user',
                ]);
            });
        });

        test('failure', async () => {
            usersService.getAll.mockImplementation(() =>
                Promise.reject(new Error('what will you do if the backend is down?')));

            store.dispatch(refreshUsers());

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(store.getState().blogs).toHaveLength(0);
        });
    });
});