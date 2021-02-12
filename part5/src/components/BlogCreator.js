import React, { useState } from 'react';
import PropTypes from 'prop-types';
import blogService from '../services/blogs';

const BlogCreator = ({ user, onBlogCreated, notify }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('https://');

    const handleChange = (setter) =>
        (e) => setter(e.target.value);

    const submit = async (e) => {
        e.preventDefault();

        try {
            await blogService.create(title, author, url, user);
        } catch (e) {
            blogService.ifBadRequest(e, (msg) => {
                notify.error(msg);
            }, () => {
                throw e;
            });
            return;
        }

        notify.msg(`new blog "${title}" by "${author}" added`);

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

BlogCreator.propTypes = {
    user: PropTypes.object.isRequired, // TODO: tighten?
    onBlogCreated: PropTypes.func.isRequired,
    notify: PropTypes.shape({
        error: PropTypes.func.isRequired,
        msg: PropTypes.func.isRequired,
    }),
};

export default BlogCreator;