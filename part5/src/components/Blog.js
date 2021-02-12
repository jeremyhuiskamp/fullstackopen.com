import React, { useState } from 'react';

const Blog = ({ blog, like, remove }) => {
    const [expanded, setExpanded] = useState(false);

    const { title, author, url, likes, user: { username } } = blog;

    const blogStyle = {
        padding: 10,
        marginTop: 10,
        background: 'aliceblue',
        cursor: 'pointer',
    };

    const blockEventPropagation = f => {
        return e => {
            e.stopPropagation();
            f(blog);
        };
    };

    return <div style={blogStyle} onClick={() => setExpanded(!expanded)}>
        &quot;<a href={url} onClick={(e) => e.stopPropagation()}>{title}</a>&quot; by <b> {author}</b>&nbsp;
        {expanded ?
            <>
                ▼
                <br />
                {likes} <span onClick={blockEventPropagation(like)}>👍</span>
                <br />
                added by: {username}
                {remove && <>
                    <br />
                    <button onClick={blockEventPropagation(remove)}>remove</button>
                </>}
            </>
            : <>►</>
        }
    </div>;
};

export default Blog;