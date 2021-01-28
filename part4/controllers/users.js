const router = require('express').Router();
const bcrypt = require('bcrypt');
require('express-async-errors');
const User = require('../models/user');

const saltRounds = 10;

router.post('/', async (request, response) => {
    const body = request.body;

    if (!body.password || typeof body.password !== 'string') {
        return response.status(400).json({ error: '`password` is required' });
    }

    if (body.password.length < 3) {
        return response.status(400).json({
            error: '`password` is shorter than the minimum allowed length (3).'
        });
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    });

    const savedUser = await user.save();
    response.json(savedUser);
});

router.get('/', async (request, response) => {
    response.json(await User.find({}).populate('blogs', { user: 0 }));
});

module.exports = router;