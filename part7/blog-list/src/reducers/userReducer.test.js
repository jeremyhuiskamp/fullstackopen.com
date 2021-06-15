import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/dom';

import { reducer } from '../store';
import loginService from '../services/login';
jest.mock('../services/login');
import { tryLogin, logout, loggedIn } from './userReducer';

describe('user reducer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });

    let store;
    beforeEach(() => {
        store = createStore(reducer, applyMiddleware(thunk));
    });

    test('by default, user is not logged in', () => {
        expect(store.getState().user).toBeNull();
    });

    describe('login', () => {
        test('success', async () => {
            const user = {
                id: '123',
                username: 'root',
            };
            loginService.login.mockResolvedValue(user);

            store.dispatch(tryLogin('root', 'sekret'));

            await waitFor(() => {
                expect(store.getState().user).toEqual(user);
            });
        });

        test('wrong credentials', async () => {
            loginService.login.mockRejectedValue({
                response: {
                    data: {
                        error: 'bad credentials'
                    },
                },
            });
            store.dispatch(tryLogin('root', 'sekret'));

            await waitFor(() => {
                expect(store.getState().notification?.error).toMatch('bad credentials');
            });
            // If there was a user logged in before this, should we expect it to
            // be cleared as well?
            expect(store.getState().user).toBeNull();
        });

        test('failed request', async () => {
            loginService.login.mockRejectedValue('backend unavailable');
            store.dispatch(tryLogin('root', 'sekret'));

            await waitFor(() => {
                expect(store.getState().notification?.error).toMatch('login failed');
            });
            // If there was a user logged in before this, should we expect it to
            // be cleared as well?
            expect(store.getState().user).toBeNull();
        });
    });

    test('logout', async () => {
        const user = {
            id: '123',
            username: 'root',
        };
        store.dispatch(loggedIn(user));

        store.dispatch(logout());

        await waitFor(() => {
            expect(store.getState().user).toBeNull();
        });
    });
});