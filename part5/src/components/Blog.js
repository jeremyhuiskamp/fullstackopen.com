import React from 'react';

const Blog = ({ blog: { title, author, likes } }) => <>
    &quot;{title}&quot; by <b>{author}</b> [{likes} 👍]
</>;

export default Blog;