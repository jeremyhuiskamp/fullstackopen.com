import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Filter from './Filter';

test('update filter', () => {
    const store = createStore(reducer, {});
    const component = render(<Provider store={store}><Filter /></Provider>);
    userEvent.type(component.getByTestId('filter'), 'aph');

    expect(store.getState().filter.filter).toEqual('aph');
});