import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('blog component', () => {
    const blog = {
        title: 'title1',
        author: 'author1',
        url: 'url1',
        likes: 2,
        user: {
            username: 'user1',
        },
    };

    let likeHandler,
        removeHandler,
        component;

    beforeEach(() => {
        likeHandler = jest.fn();
        removeHandler = jest.fn();
        component = render(
            <Blog blog={blog} like={likeHandler} remove={removeHandler} />
        );
    });

    test('renders only title and author by default', () => {
        expect(likeHandler.mock.calls).toHaveLength(0);
        expect(removeHandler.mock.calls).toHaveLength(0);

        expect(component.container).toHaveTextContent('title1');
        expect(component.container).toHaveTextContent('author1');
        expect(component.container).not.toHaveTextContent('user1');
        expect(component.container).not.toHaveTextContent('2 👍');
    });

    test('renders likes and user when expanded', () => {
        fireEvent.click(component.container.firstChild);
        expect(likeHandler.mock.calls).toHaveLength(0);
        expect(removeHandler.mock.calls).toHaveLength(0);

        expect(component.container).toHaveTextContent('title1');
        expect(component.container).toHaveTextContent('author1');
        expect(component.container).toHaveTextContent('user1');
        expect(component.container).toHaveTextContent('2 👍');
    });

    test('like callback called when like clicked', async () => {
        fireEvent.click(component.container.firstChild);
        fireEvent.click(await component.findByText('👍'));
        fireEvent.click(await component.findByText('👍'));

        expect(likeHandler.mock.calls).toHaveLength(2);
        likeHandler.mock.calls.forEach(c => {
            expect(c).toMatchObject([blog]);
        });
        expect(removeHandler.mock.calls).toHaveLength(0);
    });
});
