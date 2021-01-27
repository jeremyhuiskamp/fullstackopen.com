const router = require('express').Router();
require('express-async-errors');
const Blog = require('../models/blog');

router.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

router.post('/', async (request, response) => {
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
});

router.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

router.patch('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).end();
    }

    blog.likes = request.body.likes ?? blog.likes;
    const savedBlog = await blog.save();
    response.json(savedBlog);
});

module.exports = router;