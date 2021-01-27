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

test('blogs have id', async () => {
    const rsp = await api
        .get('/api/blogs')
        .expect(200);

    expect(rsp.body).toHaveLength(initialBlogs.length);
    rsp.body.forEach(blog => {
        expect(blog.id).toBeDefined();
        expect(blog.id.length).toBeGreaterThan(0);
    });
});

test('can post blog', async () => {
    await api.post('/api/blogs').send({
        title: 'new title',
        author: 'new author',
        url: 'new url',
        likes: 3,
    }).expect(201);

    const blogs = await api
        .get('/api/blogs')
        .expect(200);
    expect(blogs.body).toHaveLength(initialBlogs.length + 1);
    const newBlog = blogs.body.find(b => b.title === 'new title');
    expect(newBlog).toMatchObject({
        title: 'new title',
        author: 'new author',
        url: 'new url',
        likes: 3,
    });
});

test('likes defaults to 0', async () => {
    await api.post('/api/blogs').send({
        title: 'new title',
        author: 'new author',
        url: 'new url',
    }).expect(201);

    const blogs = await api
        .get('/api/blogs')
        .expect(200);
    const newBlog = blogs.body.find(b => b.title === 'new title');
    expect(newBlog).toMatchObject({
        likes: 0,
    });
});

test('required fields', async () => {
    await api
        .post('/api/blogs')
        .send({
            author: 'author3',
            url: 'url3',
            likes: 3,
        })
        .expect(400);

    await api
        .post('/api/blogs')
        .send({
            title: 'title4',
            author: 'author4',
            likes: 4,
        })
        .expect(400);
});


describe('blog deletion', () => {
    test('delete existing blog', async () => {
        const savedBlogs =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body;

        const deletedBlog =
            (await api
                .delete('/api/blogs/' + savedBlogs[0].id)
                .expect(200)
            ).body;
        expect(deletedBlog).toEqual(savedBlogs[0]);

        const savedBlogsAfterDelete =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body;
        expect(savedBlogsAfterDelete).toHaveLength(savedBlogs.length - 1);
        // hmm, are we relying on order here?
        expect(savedBlogsAfterDelete).toEqual(savedBlogs.slice(1));
    });

    test('delete non-existing blog', async () => {
        await api.delete('/api/blogs/6011cc124bf051e42dfb6e87').expect(404);
        const remainingBlogs =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body;
        expect(remainingBlogs).toHaveLength(initialBlogs.length);
    });
});


afterAll(() => {
    mongoose.connection.close();
});