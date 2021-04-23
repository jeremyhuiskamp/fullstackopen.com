import React from 'react';
import { Provider } from 'react-redux';
import AphorismList from './AphorismList';
import { createStore } from 'redux';
import { createAphorism } from '../reducers/aphorismReducer';
import { updateFilter } from '../reducers/filterReducer';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';

test('emtpy state means no aphorisms', () => {
    const store = createStore(reducer, { aphorisms: [] });
    const component = render(<Provider store={store}><AphorismList /></Provider>);
    expect(component.queryAllByText('vote')).toHaveLength(0);
});

test('render one aphorism', () => {
    const store = createStore(reducer, { aphorisms: [] });
    store.dispatch(createAphorism('aphorism1'));
    const component = render(<Provider store={store}><AphorismList /></Provider>);

    component.getByText('aphorism1');
});

test('vote for one aphorism', () => {
    const store = createStore(reducer, { aphorisms: [] });
    store.dispatch(createAphorism('aphorism1'));
    const component = render(<Provider store={store}><AphorismList /></Provider>);

    component.getByText('has 0');
    component.getByText('vote').click();
    component.getByText('has 1');
});

test('aphorisms are sorted by votes', () => {
    const store = createStore(reducer, { aphorisms: [] });
    store.dispatch(createAphorism('aphorism1'));
    store.dispatch(createAphorism('aphorism2'));
    store.dispatch(createAphorism('aphorism3'));
    const component = render(<Provider store={store}><AphorismList /></Provider>);

    const voteFor = (aphorism) => {
        within(component.getByText(aphorism).parentElement).getByText('vote').click();
    };
    voteFor('aphorism2');
    voteFor('aphorism2');
    voteFor('aphorism3');

    const sortedAphorisms = component.getAllByTestId('aphorism-content').map(p => p.innerHTML);
    expect(sortedAphorisms).toEqual(['aphorism2', 'aphorism3', 'aphorism1']);
});

test('voting for aphorism sets info notification', () => {
    const store = createStore(reducer, {
        aphorisms: [],
        notification: {},
    });
    store.dispatch(createAphorism('aphorism1'));
    const component = render(<Provider store={store}><AphorismList /></Provider>);
    const voteFor = (aphorism) => {
        within(component.getByText(aphorism).parentElement).getByText('vote').click();
    };
    voteFor('aphorism1');

    expect(store.getState().notification).toMatchObject({
        info: 'you voted for "aphorism1"',
    });
});

describe('clearing voting notification', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('notification is cleared after 5s', () => {
        const store = createStore(reducer, {
            aphorisms: [],
            notification: {},
        });
        store.dispatch(createAphorism('aphorism1'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);
        const voteFor = (aphorism) => {
            within(component.getByText(aphorism).parentElement).getByText('vote').click();
        };
        voteFor('aphorism1');

        expect(store.getState().notification).toMatchObject({
            info: 'you voted for "aphorism1"',
        });

        jest.advanceTimersByTime(5000);
        expect(store.getState().notification?.info).not.toBeDefined();
        expect(store.getState().notification?.error).not.toBeDefined();
    });

    test('clearing old notification doesn\'t clear new one', () => {
        const store = createStore(reducer, {
            aphorisms: [],
            notification: {},
        });
        store.dispatch(createAphorism('aphorism1'));
        store.dispatch(createAphorism('aphorism2'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);
        const voteFor = (aphorism) => {
            within(component.getByText(aphorism).parentElement).getByText('vote').click();
        };
        voteFor('aphorism1');

        expect(store.getState().notification).toMatchObject({
            info: 'you voted for "aphorism1"',
        });

        jest.advanceTimersByTime(3000);
        expect(store.getState().notification).toMatchObject({
            info: 'you voted for "aphorism1"',
        });

        voteFor('aphorism2');
        expect(store.getState().notification).toMatchObject({
            info: 'you voted for "aphorism2"',
        });

        jest.advanceTimersByTime(3000);
        expect(store.getState().notification).toMatchObject({
            info: 'you voted for "aphorism2"',
        });

        jest.advanceTimersByTime(3000);
        expect(store.getState().notification?.info).not.toBeDefined();
        expect(store.getState().notification?.error).not.toBeDefined();
    });
});

describe('filtering aphorisms', () => {
    test('empty filter', () => {
        const store = createStore(reducer, { aphorisms: [], filter: {} });
        store.dispatch(createAphorism('aphorism1'));
        store.dispatch(createAphorism('aphorism2'));
        store.dispatch(createAphorism('aphorism3'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);

        const filteredAphorisms = component.getAllByTestId('aphorism-content').map(p => p.innerHTML);
        expect(filteredAphorisms).toEqual(['aphorism1', 'aphorism2', 'aphorism3']);
    });

    test('non-empty filter', () => {
        const store = createStore(reducer, { aphorisms: [], filter: {} });
        store.dispatch(createAphorism('a'));
        store.dispatch(createAphorism('ap'));
        store.dispatch(createAphorism('aph'));
        store.dispatch(updateFilter('ap'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);

        const filteredAphorisms = component.getAllByTestId('aphorism-content').map(p => p.innerHTML);
        expect(filteredAphorisms).toEqual(['ap', 'aph']);
    });
});