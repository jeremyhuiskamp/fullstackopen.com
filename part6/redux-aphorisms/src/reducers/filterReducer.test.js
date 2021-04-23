const { reducer, updateFilter } = require('./filterReducer');

describe('filter', () => {
    test('default state', () => {
        const newState = reducer(undefined, undefined);
        expect(newState).toEqual({});
    });

    test('set filter action', () => {
        const newState = reducer(undefined, updateFilter('abcd'));
        expect(newState).toMatchObject({
            filter: 'abcd',
        });
    });

    test('change filter', () => {
        const initialState = reducer(undefined, updateFilter('abcd'));

        const newState = reducer(initialState, updateFilter('efgh'));

        expect(newState).toMatchObject({
            filter: 'efgh',
        });
    });
});