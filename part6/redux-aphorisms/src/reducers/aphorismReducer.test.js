const deepFreeze = require('deep-freeze');
const {
    reducer,
    initAphorisms,
    aphorismCreated,
    createAphorism,
    voteForAphorism,
} = require('./aphorismReducer');
import { reducer as fullReducer } from '../store';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/dom';
import { createStore, applyMiddleware } from 'redux';
const uuid = require('uuid');

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

    describe('initialization', () => {
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

            store.dispatch(initAphorisms());

            await waitFor(() => {
                expect(store.getState().aphorisms).toEqual(aphorisms);
            });
        });

        test('failure', async () => {
            aphorismService.getAll.mockImplementation(() =>
                Promise.reject(new Error('what will you do if the backend is down?')));

            store.dispatch(initAphorisms());

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            // TODO: test clearing of the notification?
            expect(store.getState().aphorisms).toHaveLength(0);
        });
    });

    test('aphorism created as string', () => {
        const newState = reducer([], aphorismCreated('english vocabulary is annoying'));
        expect(newState).toHaveLength(1);
        expect(newState).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    content: 'english vocabulary is annoying',
                    votes: 0,
                })]));
    });

    test('aphorism created as object', () => {
        const newState = reducer([], aphorismCreated({
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

    describe('create new aphorism', () => {
        let store;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
        });

        test('success', async () => {
            aphorismService.create.mockImplementation((aphorism) =>
                Promise.resolve({ ...aphorism, id: uuid.v4(), }));

            store.dispatch(createAphorism('wisdom!'));

            await waitFor(() => expect(store.getState().aphorisms).toHaveLength(1));
            expect(store.getState().aphorisms[0]).toMatchObject({
                content: 'wisdom!',
                votes: 0,
                id: expect.stringMatching(/[-0-9a-f]{36}/i),
            });
        });

        test('failure', async () => {
            aphorismService.create.mockImplementation((_) =>
                Promise.reject(new Error('creation failed at backend')));

            store.dispatch(createAphorism('wisdom!'));

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(store.getState().aphorisms).toHaveLength(0);
        });
    });

    describe('voting for an aphorism', () => {
        let store;
        let getAphorism;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
            store.dispatch(aphorismCreated('wisdom!'));
            getAphorism = () => store.getState().aphorisms[0];
        });

        test('success', async () => {
            aphorismService.vote.mockImplementation((aphorism) =>
                Promise.resolve({ ...aphorism, votes: aphorism.votes + 1, }));

            store.dispatch(voteForAphorism(getAphorism()));

            await waitFor(() => {
                expect(getAphorism().votes).toEqual(1);
            });
            expect(store.getState().notification).toMatchObject({
                info: 'you voted for "wisdom!"',
            });
        });

        test('failure', async () => {
            aphorismService.vote.mockImplementation(() =>
                Promise.reject(new Error('the backend is down')));

            store.dispatch(voteForAphorism(getAphorism()));

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(getAphorism().votes).toEqual(0);
        });
    });
});