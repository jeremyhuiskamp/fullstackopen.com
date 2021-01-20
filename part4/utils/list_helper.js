const totalLikes = blogs =>
    blogs.reduce((sum, blog) => sum + blog.likes, 0);

module.exports = { totalLikes };