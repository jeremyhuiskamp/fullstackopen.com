const deepFreeze = require('deep-freeze');
const {
    reducer,
    initAphorisms,
    initAphorismsThunk,
    createAphorism,
    voteForAphorism,
} = require('./aphorismReducer');
import { reducer as fullReducer } from '../store';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/dom';
import { createStore, applyMiddleware } from 'redux';

import aphorismService from '../services/aphorisms';
jest.mock('../services/aphorisms');

describe('aphorism reducer', () => {

    test('initial state should be empty', () => {
        const action = {
            type: 'DO_NOTHING',
        };

        const newState = reducer(undefined, action);

        expect(newState).toHaveLength(0);
    });

    test('initialise aphorisms', () => {
        const aphorisms = [{
            id: 1,
            content: 'aphorism1',
            votes: 0,
        }, {
            id: 2,
            content: 'aphorism2',
            votes: 4,
        }];
        deepFreeze(aphorisms);

        const newState = reducer(undefined, initAphorisms(aphorisms));

        expect(newState).toEqual(aphorisms);
    });

    describe('initialization with thunk', () => {
        let store;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
        });

        test('success', async () => {
            const aphorisms = [{
                id: 1,
                content: 'aphorism1',
                votes: 0,
            }, {
                id: 2,
                content: 'aphorism2',
                votes: 4,
            }];
            deepFreeze(aphorisms);
            aphorismService.getAll.mockResolvedValue(aphorisms);

            store.dispatch(initAphorismsThunk());

            await waitFor(() => {
                expect(store.getState().aphorisms).toEqual(aphorisms);
            });
        });

        test('failure', async () => {
            aphorismService.getAll.mockImplementation(() =>
                Promise.reject(new Error('what will you do if the backend is down?')));

            store.dispatch(initAphorismsThunk());

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            // TODO: test clearing of the notification?
            expect(store.getState().aphorisms).toHaveLength(0);
        });
    });

    test('creation of new aphorism as string', () => {
        const newState = reducer([], createAphorism('english vocabulary is annoying'));
        expect(newState).toHaveLength(1);
        expect(newState).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    content: 'english vocabulary is annoying',
                    votes: 0,
                })]));
    });

    test('creation of new aphorism as object', () => {
        const newState = reducer([], createAphorism({
            content: 'wisdom',
            votes: 3,
            id: 'abcd',
        }));
        expect(newState).toHaveLength(1);
        expect(newState).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    content: 'wisdom',
                    votes: 3,
                })]));
    });

    describe('given one existing aphorism', () => {
        const initialState = reducer([], createAphorism('aphorism1'));
        deepFreeze(initialState);
        const aphorism1 = initialState[0];
        deepFreeze(aphorism1);

        test('can vote for aphorism', () => {
            const newState = reducer(initialState, voteForAphorism(aphorism1.id));
            expect(newState).toEqual([{ ...aphorism1, votes: 1 }]);

            const newState2 = reducer(newState, voteForAphorism(aphorism1.id));
            expect(newState2).toEqual([{ ...aphorism1, votes: 2 }]);
        });
    });
});