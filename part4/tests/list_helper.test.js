const listHelper = require('../utils/list_helper');

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 42,
            },
        ]);
        expect(result).toEqual(42);
    });

    test('when list has no blogs, zero likes', () => {
        expect(listHelper.totalLikes([])).toEqual(0);
    });

    test('negative likes cancel out', () => {
        const result = listHelper.totalLikes([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 42,
            },
            {
                id: 'id2',
                title: 'title2',
                author: 'author2',
                url: 'url2',
                likes: -42,
            },
        ]);
        expect(result).toEqual(0);
    });

    test('add multiple likes', () => {
        const result = listHelper.totalLikes([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 1,
            },
            {
                id: 'id2',
                title: 'title2',
                author: 'author2',
                url: 'url2',
                likes: 2,
            },
            {
                id: 'id3',
                title: 'title3',
                author: 'author3',
                url: 'url3',
                likes: 3,
            },
        ]);
        expect(result).toEqual(6);
    });
});