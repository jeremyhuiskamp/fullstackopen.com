import React from 'react';
import { Provider } from 'react-redux';
import Aphorisms from './Aphorisms';
import { createStore } from 'redux';
import { reducer, createAphorism } from '../reducers/aphorismReducer';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';

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

test('aphorisms are sorted by votes', () => {
    const store = createStore(reducer, []);
    store.dispatch(createAphorism('aphorism1'));
    store.dispatch(createAphorism('aphorism2'));
    store.dispatch(createAphorism('aphorism3'));
    const component = render(<Provider store={store}><Aphorisms /></Provider>);

    const voteFor = (aphorism) => {
        within(component.getByText(aphorism).parentElement).getByText('vote').click();
    };
    voteFor('aphorism2');
    voteFor('aphorism2');
    voteFor('aphorism3');

    const sortedAphorisms = component.getAllByText(/aphorism[0-9]/).map(p => p.innerHTML);
    expect(sortedAphorisms).toEqual(['aphorism2', 'aphorism3', 'aphorism1']);
});