const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const bcrypt = require('bcrypt');

beforeEach(async () => {
    await User.deleteMany({});
});

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        const passwordHash = await bcrypt.hash('sekret', 10);
        await new User({ username: 'root', passwordHash }).save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await User.find({});

        const newUser = {
            username: 'username1',
            name: 'User Name1',
            password: 'password1',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await User.find({});
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper status code and message if username already taken', async () => {
        const usersAtStart = await User.find({});

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'password2',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await User.find({});
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('the user has no blogs', async () => {
        const users =
            (await api
                .get('/api/users')
                .expect(200)
            ).body;
        expect(users).toHaveLength(1);
        expect(users[0]).toMatchObject({ blogs: [] });
    });
});

describe('restrictions on user creation', () => {
    test('user name is required', async () => {
        const result = await api
            .post('/api/users')
            .send({
                password: 'sekret',
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('`username` is required');

        expect(await User.find({})).toHaveLength(0);
    });

    test('user name may not be less than 3 characters', async () => {
        const result = await api
            .post('/api/users')
            .send({
                username: 'ab',
                password: 'sekret',
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('`username`');
        expect(result.body.error).toContain('shorter');

        expect(await User.find({})).toHaveLength(0);
    });

    test('password required', async () => {
        const result = await api
            .post('/api/users')
            .send({
                username: 'abc',
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('`password` is required');

        expect(await User.find({})).toHaveLength(0);
    });

    test('password may not be less than 3 characters', async () => {
        const result = await api
            .post('/api/users')
            .send({
                username: 'abc',
                password: 'se',
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('`password`');
        expect(result.body.error).toContain('shorter');

        expect(await User.find({})).toHaveLength(0);
    });
});

afterAll(() => {
    mongoose.connection.close();
});