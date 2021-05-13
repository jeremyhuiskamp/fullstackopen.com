import { useResource } from '.';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

describe('useResource hook', () => {
    test('render fetches initial resources', async () => {
        nock('http://localhost')
            .get('/things')
            .reply(200, [{
                id: 'thing1',
            }, {
                id: 'thing2',
            }]);

        const { result } = renderHook(() =>
            useResource('http://localhost/things'));

        await waitFor(() => {
            const [resources] = result.current;
            expect(resources).toEqual([{
                id: 'thing1',
            }, {
                id: 'thing2',
            }]);
        });
    });

    test('create', async () => {
        nock('http://localhost')
            .get('/things')
            .reply(200, [{
                id: 'thing1',
            }, {
                id: 'thing2',
            }]);
        nock('http://localhost')
            .post('/things')
            .reply(201, {
                id: 'thing3',
            });

        const { result } = renderHook(() =>
            useResource('http://localhost/things'));
        await waitFor(() => {
            const [resources] = result.current;
            expect(resources).toHaveLength(2);
        });

        await act(async () => {
            const [, service] = result.current;
            const newThing = await service.create({});
            expect(newThing).toEqual({ id: 'thing3' });
        });

        await waitFor(() => {
            const [resources] = result.current;
            expect(resources).toEqual([{
                id: 'thing1',
            }, {
                id: 'thing2',
            }, {
                id: 'thing3',
            }]);
        });
    });
});