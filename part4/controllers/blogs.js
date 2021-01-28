const router = require('express').Router();
require('express-async-errors');
const Blog = require('../models/blog');
const User = require('../models/user');

router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 });
    response.json(blogs);
});

router.post('/', async (request, response) => {
    const user = await User.findById(request.body.user);
    if (!user) {
        return response.status(400).json({ error: 'unknown user' });
    }
    delete request.body.user;

    const blog = new Blog({
        ...request.body,
        user: user._id,
    });
    const result = await blog.save();

    user.blogs.push(result._id);
    await user.save();

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