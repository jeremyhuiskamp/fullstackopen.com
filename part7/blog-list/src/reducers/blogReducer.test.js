const {
    reducer,
    refreshBlogs,
    createBlog,
    likeBlog,
    removeBlog,
} = require('./blogReducer');
import { reducer as fullReducer } from '../store';
import blogService from '../services/blogs';
jest.mock('../services/blogs');

const deepFreeze = require('deep-freeze');
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { waitFor } from '@testing-library/dom';
const uuid = require('uuid');

describe('blog reducer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });

    test('initial state should be empty', () => {
        const newState = reducer(undefined, undefined);

        expect(newState).toHaveLength(0);
    });

    describe('initialisation', () => {
        let store;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
        });

        test('success', async () => {
            const blogs = [{
                id: '1',
                title: 'blog1',
                author: 'author1',
                url: 'https://url1',
                likes: 1,
                user: {
                    username: 'user1',
                },
            }, {
                id: '2',
                title: 'blog2',
                author: 'author2',
                url: 'https://url2',
                likes: 2,
                user: {
                    username: 'user2',
                },
            }];
            deepFreeze(blogs);
            blogService.getAll.mockResolvedValue(blogs);

            store.dispatch(refreshBlogs());

            await waitFor(() => {
                expect(store.getState().blogs.map(blog => blog.title)).toEqual([
                    'blog2',
                    'blog1',
                ]);
            });
        });

        test('failure', async () => {
            blogService.getAll.mockImplementation(() =>
                Promise.reject(new Error('what will you do if the backend is down?')));

            store.dispatch(refreshBlogs());

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(store.getState().blogs).toHaveLength(0);
        });
    });

    describe('create new blog', () => {
        let store;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
            store.dispatch({
                type: 'BLOG_CREATED',
                data: {
                    id: uuid.v4(),
                    title: 'title1',
                    author: 'author1',
                    url: 'url1',
                    likes: 0,
                },
            });
        });

        test('success', async () => {
            blogService.create.mockImplementation((title, author, url, _user) =>
                Promise.resolve({ title, author, url, likes: 0, id: uuid.v4(), }));
            // Not realistic, but easier for the test: we don't expect the reducer
            // to care about the blog it created, just about what the backend has.
            blogService.getAll.mockResolvedValue([]);

            store.dispatch(createBlog('title2', 'author2', 'url2'));

            await waitFor(() => expect(store.getState().notification?.info).toMatch('new blog'));
            expect(store.getState().blogs).toHaveLength(0);
        });

        test('failure', async () => {
            blogService.create.mockImplementation((_) =>
                Promise.reject(new Error('creation failed at backend')));
            blogService.ifBadRequest.mockImplementation((e, _, otherwise) => {
                otherwise(e);
            });

            store.dispatch(createBlog('title2', 'author2', 'url2'));

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(store.getState().blogs).toHaveLength(1);
        });

        test('invalid blog', async () => {
            blogService.create.mockImplementation(() =>
                Promise.reject('not interesting enough'));
            blogService.ifBadRequest.mockImplementation((e, onBadRequest, _) => {
                onBadRequest(e);
            });

            store.dispatch(createBlog('title2', 'author2', 'url2'));

            await waitFor(() =>
                expect(store.getState().notification?.error).toMatch(
                    'not interesting enough'));
        });
    });

    describe('liking a blog', () => {
        let store;
        let getBlog;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
            store.dispatch({
                type: 'BLOG_CREATED',
                data: {
                    id: uuid.v4(),
                    title: 'title1',
                    author: 'author1',
                    url: 'url1',
                    likes: 0,
                },
            });
            store.dispatch({
                type: 'BLOG_CREATED',
                data: {
                    id: uuid.v4(),
                    title: 'title2',
                    author: 'author2',
                    url: 'url2',
                    likes: 0,
                },
            });
            getBlog = (title) => store.getState().blogs.find(b => b.title === title);
        });

        test('success', async () => {
            blogService.like.mockImplementation((id, likes, _user) =>
                Promise.resolve({ id, likes, }));

            store.dispatch(likeBlog(getBlog('title2').id, 1, {}));

            await waitFor(() => {
                expect(getBlog('title2').likes).toEqual(1);
                expect(store.getState().blogs.map(blog => blog.title)).toEqual([
                    'title2',
                    'title1',
                ]);
            });
        });

        test('failure', async () => {
            blogService.like.mockImplementation(() =>
                Promise.reject(new Error('the backend is down')));

            store.dispatch(likeBlog(getBlog('title1')));

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(getBlog('title1').likes).toEqual(0);
        });
    });

    describe('deletion', () => {
        let store;
        let getBlog;
        beforeEach(() => {
            store = createStore(fullReducer, applyMiddleware(thunk));
            store.dispatch({
                type: 'BLOG_CREATED',
                data: {
                    id: uuid.v4(),
                    title: 'title1',
                    author: 'author1',
                    url: 'url1',
                    likes: 1,
                },
            });
            store.dispatch({
                type: 'BLOG_CREATED',
                data: {
                    id: uuid.v4(),
                    title: 'title2',
                    author: 'author2',
                    url: 'url2',
                    likes: 2,
                },
            });
            getBlog = (title) => store.getState().blogs.find(b => b.title === title);
        });

        test('success', async () => {
            blogService.remove.mockImplementation(() => Promise.resolve());
            window.confirm = jest.fn(() => true);

            store.dispatch(removeBlog(getBlog('title1'), {}));

            await waitFor(() => {
                expect(store.getState().blogs).toHaveLength(1);
                expect(store.getState().blogs[0].title).toEqual('title2');
            });
        });

        test('not confirmed', async () => {
            blogService.remove.mockImplementation(() => {
                throw new Error("don't even call this");
            });
            window.confirm = jest.fn(() => false);

            store.dispatch(removeBlog(getBlog('title1'), {}));

            expect(blogService.remove).toBeCalledTimes(0);
            // TODO: wait for all promises to settle,
            // then assert blog is still in store?
        });

        test('failure', async () => {
            blogService.remove.mockImplementation(() =>
                Promise.reject(new Error('the backend is down')));
            window.confirm = jest.fn(() => true);

            store.dispatch(removeBlog(getBlog('title1'), {}));

            await waitFor(() => expect(store.getState().notification?.error).toMatch('failed'));
            expect(store.getState().blogs).toHaveLength(2);
        });
    });
});