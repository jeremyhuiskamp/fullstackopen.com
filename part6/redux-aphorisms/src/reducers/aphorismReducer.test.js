const deepFreeze = require('deep-freeze');
const { reducer, createAphorism, voteForAphorism } = require('./aphorismReducer');

describe('aphorism reducer', () => {

    describe('aphorism reducer initial state', () => {
        const action = {
            type: 'DO_NOTHING',
        };

        const newState = reducer(undefined, action);

        test('initial state should not be empty', () => {
            expect(newState).not.toHaveLength(0);
        });

        test('initial aphorisms should have unique ids', () => {
            const uniqueIds = new Set(newState.map(aphorism => aphorism.id));
            expect(uniqueIds.size).toEqual(newState.length);
        });

        test('initial aphorisms should have 0 votes', () => {
            newState.forEach(aphorism => {
                expect(aphorism).toMatchObject({ votes: 0 });
            });
        });
    });

    test('creation of new aphorism', () => {
        const newState = reducer([], createAphorism('english vocabulary is annoying'));
        expect(newState).toHaveLength(1);
        expect(newState).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    content: 'english vocabulary is annoying',
                    votes: 0,
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