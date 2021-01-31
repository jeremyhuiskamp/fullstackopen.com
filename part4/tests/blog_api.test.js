const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

var initialUser;
var validToken;

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

// Replaces the blog's user with just its id.
const withOnlyUserId = (blog) => ({
    ...blog,
    user: blog.user.id,
});

const withFullUser = (blog, blogWithUser) => ({
    ...blog,
    user: blogWithUser.user,
});

beforeEach(async () => {
    await User.deleteMany({});
    initialUser = await new User({
        username: 'user1',
        name: 'user number1',
        passwordHash: 'sekret',
    }).save();

    validToken = jwt.sign({
        username: initialUser.username,
        id: initialUser._id.toString(),
    }, process.env.SECRET);

    await Blog.deleteMany({});
    await Promise.all(initialBlogs
        .map(b => ({ ...b, user: initialUser._id }))
        .map(b => new Blog(b).save()));
});

describe('retrieving blogs', () => {
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
});

describe('creating blogs', () => {
    test('can post blog', async () => {
        await api.post('/api/blogs').send({
            title: 'new title',
            author: 'new author',
            url: 'new url',
            likes: 3,
        })
            .set('authorization', 'bearer ' + validToken)
            .expect(201);

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
            user: {
                id: initialUser._id.toString(),
            },
        });
    });

    test('likes defaults to 0', async () => {
        await api.post('/api/blogs').send({
            title: 'new title',
            author: 'new author',
            url: 'new url',
        })
            .set('authorization', 'bearer ' + validToken)
            .expect(201);

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
            .set('authorization', 'bearer ' + validToken)
            .expect(400);

        await api
            .post('/api/blogs')
            .send({
                title: 'title4',
                author: 'author4',
                likes: 4,
            })
            .set('authorization', 'bearer ' + validToken)
            .expect(400);
    });

    test('token required', async () => {
        await api.post('/api/blogs').send({
            title: 'new title',
            author: 'new author',
            url: 'new url',
            likes: 3,
        }).expect(401);
    });
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
                .set('authorization', 'bearer ' + validToken)
                .expect(200)
            ).body;
        expect(deletedBlog).toEqual(withOnlyUserId(savedBlogs[0]));

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
        await api
            .delete('/api/blogs/6011cc124bf051e42dfb6e87')
            .set('authorization', 'bearer ' + validToken)
            .expect(404);

        const remainingBlogs =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body;
        expect(remainingBlogs).toHaveLength(initialBlogs.length);
    });

    test('token required', async () => {
        const savedBlogs =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body;

        await api
            .delete('/api/blogs/' + savedBlogs[0].id)
            .expect(401);
    });

    test('only user who created blog can delete it', async () => {
        const anotherUser = await new User({
            username: 'user2',
            name: 'user number2',
            passwordHash: 'sekret',
        }).save();

        const anotherToken = jwt.sign({
            username: anotherUser.username,
            id: anotherUser._id.toString(),
        }, process.env.SECRET);

        const savedBlogs =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body;

        await api
            .delete('/api/blogs/' + savedBlogs[0].id)
            .set('authorization', 'bearer ' + anotherToken)
            .expect(403);
    });
});

describe('blog updating', () => {
    test('update existing blog', async () => {
        const savedBlog =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body[0];

        const updatedBlog =
            (await api
                .patch('/api/blogs/' + savedBlog.id)
                .send({
                    likes: 427000,
                })
                .set('authorization', 'bearer ' + validToken)
                .expect(200)
            ).body;

        expect(updatedBlog).toEqual({
            ...withOnlyUserId(savedBlog),
            likes: 427000,
        });

        const allBlogs =
            (await api
                .get('/api/blogs/')
                .expect(200)
            ).body;

        expect(allBlogs.find(b => b.id === savedBlog.id)).toEqual(withFullUser(updatedBlog, savedBlog));
    });

    test('update non-existing blog', async () => {
        await api
            .patch('/api/blogs/6011cc124bf051e42dfb6e87')
            .send({
                likes: 427000,
            })
            .set('authorization', 'bearer ' + validToken)
            .expect(404);
    });

    test('token required', async () => {
        const savedBlog =
            (await api
                .get('/api/blogs')
                .expect(200)
            ).body[0];

        await api
            .patch('/api/blogs/' + savedBlog.id)
            .send({
                likes: 427000,
            }).expect(401);
    });
});

afterAll(() => {
    mongoose.connection.close();
});