import React from 'react';
import { Provider } from 'react-redux';
import AphorismForm from './AphorismForm';
import { createStore } from 'redux';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

test('create aphorism', () => {
    const store = createStore(reducer, { aphorisms: [] });
    const component = render(<Provider store={store}><AphorismForm /></Provider>);
    userEvent.type(component.getByTestId('newAphorism'), 'aphorism1');
    component.getByText('create').click();

    const storedAphorisms = store.getState().aphorisms;
    expect(storedAphorisms).toHaveLength(1);
    expect(storedAphorisms[0]).toMatchObject({
        content: 'aphorism1',
        votes: 0,
    });

    // form is empty afterwards:
    expect(component.getByTestId('newAphorism')).toHaveValue('');
});