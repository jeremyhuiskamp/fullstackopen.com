import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogCreator = ({ createBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('https://');

    const handleChange = (setter) =>
        (e) => setter(e.target.value);

    const submit = async (e) => {
        e.preventDefault();

        createBlog(title, author, url);

        setTitle('');
        setAuthor('');
        setUrl('https://');
    };

    return <div>
        <h2>enter a new blog</h2>
        <form data-testid='createBlogForm' onSubmit={submit}>
            <label htmlFor='blogTitle'>title: </label>
            <input id='blogTitle' name='blogTitle' value={title} onChange={handleChange(setTitle)} />
            <br />

            <label htmlFor='blogAuthor'>author: </label>
            <input id='blogAuthor' name='blogAuthor' value={author} onChange={handleChange(setAuthor)} />
            <br />

            <label htmlFor='blogUrl'>url: </label>
            <input id='blogUrl' name='blogUrl' value={url} onChange={handleChange(setUrl)} />
            <br />

            <button type="submit">submit</button>
        </form>
    </div >;
};

BlogCreator.propTypes = {
    createBlog: PropTypes.func.isRequired,
};

export default BlogCreator;