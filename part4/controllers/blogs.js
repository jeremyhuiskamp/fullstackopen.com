const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('express-async-errors');
const Blog = require('../models/blog');
const User = require('../models/user');

router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 });
    response.json(blogs);
});

router.post('/', async (request, response) => {
    const authenticatedUser = await getAuthenticatedUser(request);
    if (!authenticatedUser) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = new Blog({
        ...request.body,
        user: authenticatedUser._id,
    });
    const result = await blog.save();

    authenticatedUser.blogs.push(result._id);
    await authenticatedUser.save();

    response.status(201).json(result);
});

router.delete('/:id', async (request, response) => {
    const authenticatedUser = await getAuthenticatedUser(request);
    if (!authenticatedUser) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = await Blog.findByIdAndDelete(request.params.id);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

router.patch('/:id', async (request, response) => {
    const authenticatedUser = await getAuthenticatedUser(request);
    if (!authenticatedUser) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).end();
    }

    blog.likes = request.body.likes ?? blog.likes;
    const savedBlog = await blog.save();
    response.json(savedBlog);
});

const getAuthenticatedUser = async request => {
    const authorization = request.get('authorization');
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
        return undefined;
    }

    const token = authorization.substring(7);
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);

        return await User.findById(decodedToken.id);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return undefined;
        }
        throw e;
    }
};

module.exports = router;