import React from 'react';
import { Provider } from 'react-redux';
import AphorismList from './AphorismList';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { aphorismCreated } from '../reducers/aphorismReducer';
import { updateFilter } from '../reducers/filterReducer';
import { reducer } from '../store';
import { render } from '@testing-library/react';
import { within, waitFor } from '@testing-library/dom';

import aphorismService from '../services/aphorisms';
jest.mock('../services/aphorisms');

describe('display aphorism list', () => {
    let store;
    beforeEach(() => {
        store = createStore(reducer, applyMiddleware(thunk));

        aphorismService.vote.mockImplementation(aphorism =>
            Promise.resolve({ ...aphorism, votes: aphorism.votes + 1 }));
    });

    test('emtpy state means no aphorisms', () => {
        const component = render(<Provider store={store}><AphorismList /></Provider>);
        expect(component.queryAllByText('vote')).toHaveLength(0);
    });

    test('render one aphorism', () => {
        store.dispatch(aphorismCreated('aphorism1'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);

        component.getByText('aphorism1');
    });

    test('vote for one aphorism', async () => {
        store.dispatch(aphorismCreated('aphorism1'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);

        component.getByText('has 0');
        component.getByText('vote').click();
        await component.findByText('has 1');
    });

    test('aphorisms are sorted by votes', async () => {
        store.dispatch(aphorismCreated('aphorism1'));
        store.dispatch(aphorismCreated('aphorism2'));
        store.dispatch(aphorismCreated('aphorism3'));
        const component = render(<Provider store={store}><AphorismList /></Provider>);

        const voteFor = (aphorism) => {
            within(component.getByText(aphorism).parentElement).getByText('vote').click();
        };
        voteFor('aphorism2');
        voteFor('aphorism2');
        voteFor('aphorism3');

        await waitFor(() => {
            const sortedAphorisms = component.getAllByTestId('aphorism-content').map(p => p.innerHTML);
            expect(sortedAphorisms).toEqual(['aphorism2', 'aphorism3', 'aphorism1']);
        });
    });

    test('voting for aphorism sets info notification', () => {
        store.dispatch(aphorismCreated('aphorism1'));
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
            store.dispatch(aphorismCreated('aphorism1'));
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
            store.dispatch(aphorismCreated('aphorism1'));
            store.dispatch(aphorismCreated('aphorism2'));
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
            store.dispatch(aphorismCreated('aphorism1'));
            store.dispatch(aphorismCreated('aphorism2'));
            store.dispatch(aphorismCreated('aphorism3'));
            const component = render(<Provider store={store}><AphorismList /></Provider>);

            const filteredAphorisms = component.getAllByTestId('aphorism-content').map(p => p.innerHTML);
            expect(filteredAphorisms).toEqual(['aphorism1', 'aphorism2', 'aphorism3']);
        });

        test('non-empty filter', () => {
            store.dispatch(aphorismCreated('a'));
            store.dispatch(aphorismCreated('ap'));
            store.dispatch(aphorismCreated('aph'));
            store.dispatch(updateFilter('ap'));
            const component = render(<Provider store={store}><AphorismList /></Provider>);

            const filteredAphorisms = component.getAllByTestId('aphorism-content').map(p => p.innerHTML);
            expect(filteredAphorisms).toEqual(['ap', 'aph']);
        });
    });
});