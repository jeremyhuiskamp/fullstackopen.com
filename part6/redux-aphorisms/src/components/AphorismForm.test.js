import React from 'react';
import { Provider } from 'react-redux';
import AphorismForm from './AphorismForm';
import { createStore } from 'redux';
import { reducer } from '../reducers/aphorismReducer';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

test('create aphorism', () => {
    const store = createStore(reducer, []);
    const component = render(<Provider store={store}><AphorismForm /></Provider>);
    userEvent.type(component.getByTestId('newAphorism'), 'aphorism1');
    component.getByText('create').click();

    expect(store.getState()).toHaveLength(1);
    expect(store.getState()[0]).toMatchObject({
        content: 'aphorism1',
        votes: 0,
    });

    // form is empty afterwards:
    expect(component.getByTestId('newAphorism')).toHaveValue('');
});