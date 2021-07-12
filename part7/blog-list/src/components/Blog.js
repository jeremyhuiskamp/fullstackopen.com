import React from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, like, remove }) => {
    if (!blog) {
        // TODO: consider showing "not found"
        // Not sure here if we're waiting for the blogs to arrive, or if the
        // blog doesn't actually exist...
        return <></>;
    }

    const { title, author, url, likes, user: { username } } = blog;

    const blockEventPropagation = f => {
        return e => {
            e.stopPropagation();
            f(blog);
        };
    };

    return <div className='blog'>
        <h2>{title} <i>by</i> {author}</h2>
        <a href={url}>{url}</a>

        <br />
        {likes} <span onClick={blockEventPropagation(like)}>👍</span>
        <br />
        added by: {username}
        {remove && <>
            <br />
            <button onClick={blockEventPropagation(remove)}>remove</button>
        </>}
    </div>;
};

Blog.propTypes = {
    blog: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
        }),
    }),
    like: PropTypes.func.isRequired,
    remove: PropTypes.func,
};

export default Blog;