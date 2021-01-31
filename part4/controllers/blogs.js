const router = require('express').Router();
require('express-async-errors');
const Blog = require('../models/blog');
const { requireAuthenticatedUser } = require('../utils/middleware');

router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 });
    response.json(blogs);
});

router.post('/', requireAuthenticatedUser, async (request, response) => {
    const blog = new Blog({
        ...request.body,
        user: request.user._id,
    });
    const result = await blog.save();

    request.user.blogs.push(result._id);
    await request.user.save();

    response.status(201).json(result);
});

router.delete('/:id', requireAuthenticatedUser, async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

router.patch('/:id', requireAuthenticatedUser, async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).end();
    }

    blog.likes = request.body.likes ?? blog.likes;
    const savedBlog = await blog.save();
    response.json(savedBlog);
});

module.exports = router;