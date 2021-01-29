const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const jwt = require('jsonwebtoken');

var initialUser;

beforeAll(async () => {
    await User.deleteMany({});
    initialUser = await new User({
        username: 'user1',
        name: 'user number1',
        passwordHash: bcrypt.hashSync('sekret', 1),
    }).save();
});

test('can log in with valid password', async () => {
    const rsp = await api
        .post('/api/login')
        .send({
            username: 'user1',
            password: 'sekret',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
    const { token, username, name } = rsp.body;

    expect(username).toBe('user1');
    expect(name).toBe('user number1');
    const decodedToken = jwt.decode(token);
    expect(decodedToken).toMatchObject({
        username: 'user1',
        id: initialUser.id,
    });
});

describe('failed ways to log in', () => {
    test.each([
        ['invalid password', {
            username: 'user1',
            password: 'notsekret',
        }],
        ['invalid user', {
            username: 'user2',
            password: 'sekret',
        }],
        ['no password', {
            username: 'user1',
        }],
        ['no user', {
            password: 'sekret',
        }],
    ])('%s', async (msg, request) => {
        const rsp = await api
            .post('/api/login')
            .send(request)
            .expect(401)
            .expect('Content-Type', /application\/json/);

        const { token, error } = rsp.body;
        expect(token).not.toBeDefined();
        expect(error).toContain('invalid username or password');
    });
});

afterAll(() => {
    mongoose.connection.close();
});