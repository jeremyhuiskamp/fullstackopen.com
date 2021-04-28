import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './store';
import { render, waitFor } from '@testing-library/react';
import App from './App';

import aphorismService from './services/aphorisms';
jest.mock('./services/aphorisms');

describe('App component', () => {
    test('load aphorisms on startup', async () => {
        aphorismService.getAll.mockResolvedValue([{
            id: '1',
            content: 'tricky mocks',
            votes: 3,
        }]);

        const store = createStore(reducer);
        render(<Provider store={store}><App /></Provider>);

        await waitFor(() => expect(store.getState().aphorisms).toHaveLength(1));
    });

    test('display error if startup load fails', async () => {
        aphorismService.getAll.mockImplementation(() =>
            Promise.reject(new Error('pretending you forgot to start json-server')));

        const store = createStore(reducer);
        render(<Provider store={store}><App /></Provider>);

        await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
        // TODO: test notification clearance
    });
});