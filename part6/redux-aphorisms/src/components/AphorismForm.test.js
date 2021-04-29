import React from 'react';
import { Provider } from 'react-redux';
import AphorismForm from './AphorismForm';
import { createStore } from 'redux';
import { reducer } from '../store';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import aphorismService from '../services/aphorisms';
jest.mock('../services/aphorisms');

test('create aphorism', async () => {
    aphorismService.create.mockImplementation(aphorism => Promise.resolve({
        ...aphorism,
        id: '12345'
    }));

    const store = createStore(reducer, { aphorisms: [] });
    const component = render(<Provider store={store}><AphorismForm /></Provider>);
    userEvent.type(component.getByTestId('newAphorism'), 'aphorism1');
    component.getByText('create').click();

    const storedAphorisms = await waitFor(() => {
        const storedAphorisms = store.getState().aphorisms;
        expect(storedAphorisms).toHaveLength(1);
        return storedAphorisms;
    });

    expect(storedAphorisms[0]).toMatchObject({
        content: 'aphorism1',
        votes: 0,
        id: '12345',
    });

    // form is empty afterwards:
    expect(component.getByTestId('newAphorism')).toHaveValue('');

    // aphorism was created on backend:
    expect(aphorismService.create).toHaveBeenCalled();
});