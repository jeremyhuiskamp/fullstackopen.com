import nock from 'nock';
import aphorismService from './aphorisms';
const uuid = require('uuid');

// https://github.com/nock/nock#axios
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('aphorism service', () => {
    test('get all aphorisms', async () => {
        const servedAphorisms = [{
            id: 1,
            content: 'aphorism1',
            votes: 0,
        }, {
            id: 2,
            content: 'aphorism2',
            votes: 3,
        }];

        nock('http://localhost:3001')
            .get('/aphorisms')
            .reply(200, servedAphorisms);

        const allAphorisms = await aphorismService.getAll();
        expect(allAphorisms).toEqual(servedAphorisms);
    });

    test('create aphorism', async () => {
        nock('http://localhost:3001')
            .post('/aphorisms')
            .reply(201, (_uri, reqBody) => ({ ...reqBody, id: uuid.v4(), }));

        const newAphorism = {
            content: 'wisdom',
            votes: 0,
        };

        const createdAphorism = await aphorismService.create(newAphorism);
        expect(createdAphorism).toMatchObject(newAphorism);
        expect(createdAphorism.id).toBeDefined();
    });

    test('vote', async () => {
        nock('http://localhost:3001')
            .patch('/aphorisms/12345')
            .reply(200, (_uri, reqBody) => ({
                votes: reqBody.votes,
                content: 'wisdom!',
                id: '12345',
            }));

        const updatedAphorism = await aphorismService.vote({
            id: '12345',
            content: 'wisdom!',
            votes: 2,
        });

        expect(updatedAphorism).toMatchObject({
            content: 'wisdom!',
            votes: 3,
            id: '12345',
        });
    });
});