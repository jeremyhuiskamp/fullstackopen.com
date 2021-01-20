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

describe('favourite blog', () => {
    test('null for no blogs', () => {
        expect(listHelper.favouriteBlog([])).toEqual(null);
    });

    test('only blog is favourite', () => {
        expect(listHelper.favouriteBlog([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 1,
            },
        ])).toEqual({
            title: 'title1',
            author: 'author1',
            likes: 1,
        });
    });

    test('2 likes is better than 1', () => {
        expect(listHelper.favouriteBlog([
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
        ])).toEqual({
            title: 'title2',
            author: 'author2',
            likes: 2,
        });
    });

    test('2 likes is better than 1, even if it comes first', () => {
        expect(listHelper.favouriteBlog([
            {
                id: 'id2',
                title: 'title2',
                author: 'author2',
                url: 'url2',
                likes: 2,
            },
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 1,
            },
        ])).toEqual({
            title: 'title2',
            author: 'author2',
            likes: 2,
        });
    });

    test('return last amongst ties', () => {
        // this behaviour isn't mandated, but lets make sure we understand
        // what we've implemented.
        expect(listHelper.favouriteBlog([
            {
                id: 'id2',
                title: 'title2',
                author: 'author2',
                url: 'url2',
                likes: 2,
            },
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 2,
            },
        ])).toEqual({
            title: 'title1',
            author: 'author1',
            likes: 2,
        });
    });
});