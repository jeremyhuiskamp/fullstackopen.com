const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
    {
        title: 'title1',
        author: 'author1',
        url: 'url1',
        likes: 1,
    },
    {
        title: 'title2',
        author: 'author2',
        url: 'url2',
        likes: 2,
    },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    await Promise.all(initialBlogs.map(b => new Blog(b).save()));
});

test('initial blogs are returned as json', async () => {
    const rsp = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(rsp.body).toHaveLength(initialBlogs.length);
});

afterAll(() => {
    mongoose.connection.close();
});