const listHelper = require('../utils/list_helper');
const _ = require('lodash');

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
    test('undefined for no blogs', () => {
        expect(listHelper.favouriteBlog([])).toEqual(undefined);
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

describe('most blogs', () => {
    test('no blogs means undefined', () => {
        expect(listHelper.mostBlogs([])).not.toBeDefined();
    });

    test('one blog is an easy competition', () => {
        expect(listHelper.mostBlogs([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 2,
            },
        ])).toEqual({
            author: 'author1',
            blogs: 1,
        });
    });

    test('one author is still an easy competition', () => {
        expect(listHelper.mostBlogs([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 2,
            },
            {
                id: 'id2',
                title: 'title2',
                author: 'author1',
                url: 'url2',
                likes: 42,
            },
        ])).toEqual({
            author: 'author1',
            blogs: 2,
        });
    });

    test('lots of data', () => {
        // TODO: log a randomization seed for reproducible shuffling
        expect(listHelper.mostBlogs(_.shuffle([
            {
                id: 'id1',
                title: 'title1',
                author: 'author1',
                url: 'url1',
                likes: 2,
            },
            {
                id: 'id2.1',
                title: 'title2.1',
                author: 'author2',
                url: 'url2.1',
                likes: 42,
            },
            {
                id: 'id2.2',
                title: 'title2.2',
                author: 'author2',
                url: 'url2.2',
                likes: 9,
            },
            {
                id: 'id3.1',
                title: 'title3.1',
                author: 'author3',
                url: 'url3.1',
                likes: 3,
            },
            {
                id: 'id3.2',
                title: 'title3.2',
                author: 'author3',
                url: 'url3.2',
                likes: 93,
            },
            {
                id: 'id3.3',
                title: 'title3.3',
                author: 'author3',
                url: 'url3.3',
                likes: 39,
            },
        ]))).toEqual({
            author: 'author3',
            blogs: 3,
        });
    });

    test('in case of tie, first alphabetical author wins', () => {
        const blogs = [
            {
                id: 'id1',
                title: 'title1',
                author: 'authorA',
                url: 'url1',
                likes: 1,
            },
            {
                id: 'id2',
                title: 'title2',
                author: 'authorB',
                url: 'url2',
                likes: 2,
            },
        ];

        expect(listHelper.mostBlogs(blogs)).toEqual({
            author: 'authorA',
            blogs: 1,
        });

        blogs.reverse();

        // same output:
        expect(listHelper.mostBlogs(blogs)).toEqual({
            author: 'authorA',
            blogs: 1,
        });
    });
});