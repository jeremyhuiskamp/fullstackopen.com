import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer } from './store';
import { render } from '@testing-library/react';
import App from './App';

import { initAphorismsThunk } from './reducers/aphorismReducer';
jest.mock('./reducers/aphorismReducer', () => ({
    // mock only specific functions from the module:
    ...jest.requireActual('./reducers/aphorismReducer'),
    initAphorismsThunk: jest.fn(),
}));

describe('App component', () => {
    test('try to load aphorisms on startup', () => {
        const mockThunk = jest.fn();
        initAphorismsThunk.mockReturnValue(mockThunk);

        const store = createStore(reducer, applyMiddleware(thunk));
        render(<Provider store={store}><App /></Provider>);

        // We don't care what the action does, only that it is dispatched
        // exactly once:
        expect(mockThunk).toHaveBeenCalledTimes(1);
    });
});