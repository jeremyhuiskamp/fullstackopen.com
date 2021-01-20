const totalLikes = blogs =>
    blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favouriteBlog = blogs =>
    blogs.reduce((fave, blog) => fave?.likes > blog.likes ? fave : {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
    }, null);

module.exports = { totalLikes, favouriteBlog };