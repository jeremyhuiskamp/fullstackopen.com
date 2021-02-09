import React, { useState } from 'react';

const Blog = ({ blog: { id, title, author, url, likes, user } }) => {
    const [expanded, setExpanded] = useState(false);

    const blogStyle = {
        padding: 10,
        marginTop: 10,
        background: 'aliceblue',
        cursor: 'pointer',
    };

    const like = (e) => {
        e.stopPropagation();
        console.log(`you liked ${id}`);
    };

    return <div style={blogStyle} onClick={() => setExpanded(!expanded)}>
        &quot;<a href={url} onClick={(e) => e.stopPropagation()}>{title}</a>&quot; by <b> {author}</b>&nbsp;
        {expanded ?
            <>
                ▼
                <br />
                {likes} <span onClick={like}>👍</span>
                <br />
                added by: {user.username}
            </>
            : <>►</>
        }
    </div>;
};

export default Blog;