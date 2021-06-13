import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogCreator from './BlogCreator';

test('create blog', () => {
    const callback = jest.fn();
    const component = render(
        <BlogCreator createBlog={callback} />
    );

    // empty to start with:
    expect(component.getByTestId('createBlogForm')).toHaveFormValues({
        blogTitle: '',
        blogAuthor: '',
        blogUrl: 'https://'
    });

    userEvent.type(component.getByLabelText(/title/i), 'my blog title');
    userEvent.type(component.getByLabelText(/author/i), 'my blog author');
    userEvent.type(component.getByLabelText(/url/i), 'foo.bar');
    userEvent.click(component.getByText(/submit/i));

    expect(callback.mock.calls).toHaveLength(1);
    expect(callback.mock.calls[0]).toEqual(['my blog title', 'my blog author', 'https://foo.bar']);

    // empty again after submitting:
    expect(component.getByTestId('createBlogForm')).toHaveFormValues({
        blogTitle: '',
        blogAuthor: '',
        blogUrl: 'https://'
    });
});