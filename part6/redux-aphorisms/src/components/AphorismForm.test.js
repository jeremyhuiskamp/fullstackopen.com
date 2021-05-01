import React from 'react';
import { Provider } from 'react-redux';
import AphorismForm from './AphorismForm';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import { createAphorism } from '../reducers/aphorismReducer';
jest.mock('../reducers/aphorismReducer', () => ({
    // mock only specific functions from the module:
    ...jest.requireActual('../reducers/aphorismReducer'),
    createAphorism: jest.fn(),
}));

test('create aphorism', async () => {
    const mockThunk = jest.fn();
    createAphorism.mockReturnValue(mockThunk);

    const store = createStore(reducer, applyMiddleware(thunk));
    const component = render(<Provider store={store}><AphorismForm /></Provider>);
    userEvent.type(component.getByTestId('newAphorism'), 'aphorism1');
    component.getByText('create').click();

    // form is empty afterwards:
    expect(component.getByTestId('newAphorism')).toHaveValue('');

    expect(mockThunk).toHaveBeenCalledTimes(1);
});