import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

test('renders only title and author by default', () => {
    const blog = {
        title: 'title1',
        author: 'author1',
        url: 'url1',
        likes: 2,
        user: {
            username: 'user1',
        },
    };

    const component = render(
        <Blog blog={blog} like={() => { }} remove={() => { }} />
    );

    expect(component.container).toHaveTextContent('title1');
    expect(component.container).toHaveTextContent('author1');
    expect(component.container).not.toHaveTextContent('user1');
    expect(component.container).not.toHaveTextContent('2 👍');
});

test('renders likes and user when expanded', () => {
    const blog = {
        title: 'title1',
        author: 'author1',
        url: 'url1',
        likes: 2,
        user: {
            username: 'user1',
        },
    };

    const handler = jest.fn();

    const component = render(
        <Blog blog={blog} like={handler} remove={handler} />
    );

    fireEvent.click(component.container.firstChild);
    expect(handler.mock.calls).toHaveLength(0);

    expect(component.container).toHaveTextContent('title1');
    expect(component.container).toHaveTextContent('author1');
    expect(component.container).toHaveTextContent('user1');
    expect(component.container).toHaveTextContent('2 👍');
});