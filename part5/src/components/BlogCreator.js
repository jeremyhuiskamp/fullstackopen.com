import React, { useState } from 'react';
import blogService from '../services/blogs';

const BlogCreator = ({ user, onBlogCreated }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('https://');

    const handleChange = (setter) =>
        (e) => setter(e.target.value);

    const submit = async (e) => {
        e.preventDefault();

        if (title.trim() === '' || author.trim() === '' || url.trim() === '') {
            // TODO: some kind of fancy validation and alerting system...
            return;
        }

        // TODO: catch the 400 error for an invalid submission
        await blogService.create(title, author, url, user);

        setTitle('');
        setAuthor('');
        setUrl('https://');

        onBlogCreated();
    };

    return <div>
        <h2>enter a new blog</h2>
        <form onSubmit={submit}>
            title:
            &nbsp;
            <input value={title} onChange={handleChange(setTitle)} />
            <br />

            author:
            &nbsp;
            <input value={author} onChange={handleChange(setAuthor)} />
            <br />

            url:
            &nbsp;
            <input value={url} onChange={handleChange(setUrl)} />
            <br />

            <button type="submit">submit</button>
        </form>
    </div >;
};

export default BlogCreator;