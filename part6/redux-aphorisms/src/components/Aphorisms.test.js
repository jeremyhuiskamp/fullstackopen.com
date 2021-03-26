import React from 'react';
import { Provider } from 'react-redux';
import Aphorisms from './Aphorisms';
import { createStore } from 'redux';
import { reducer, createAphorism } from '../reducers/aphorismReducer';
import { render } from '@testing-library/react';

test('emtpy state means no aphorisms', () => {
    const store = createStore(reducer, []);
    const component = render(<Provider store={store}><Aphorisms /></Provider>);
    expect(component.queryAllByText('vote')).toHaveLength(0);
});

test('render one aphorism', () => {
    const store = createStore(reducer, []);
    store.dispatch(createAphorism('aphorism1'));
    const component = render(<Provider store={store}><Aphorisms /></Provider>);

    component.getByText('aphorism1');
});

test('vote for one aphorism', () => {
    const store = createStore(reducer, []);
    store.dispatch(createAphorism('aphorism1'));
    const component = render(<Provider store={store}><Aphorisms /></Provider>);

    component.getByText('has 0');
    component.getByText('vote').click();
    component.getByText('has 1');
});