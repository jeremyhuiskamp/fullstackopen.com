const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
    logger.info(request.method, request.path, request.body);
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        logger.info(error.message);
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        logger.info(error.message);
        return response.status(400).json({ error: error.message });
    }

    logger.error(error.message);

    next(error);
};

// Checks authorization header for a bearer token, rejecting responses with an
// invalid token, and storing validated tokens in request.token.
//
// Requests with no bearer token are allowed through, but request.token is not
// set.  This should be to fine to put in front of all api calls.
const validateToken = (request, response, next) => {
    const authorization = request.get('authorization');
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
        return next();
    }

    const token = authorization.substring(7);
    try {
        request.token = jwt.verify(token, process.env.SECRET);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return response
                .status(401)
                .json({ error: 'token missing or invalid' });
        }
        throw e;
    }
    next();
};

// Checks for request.token (populated by validateToken above) and looks up the
// user that is referenced, storing it in request.user.
//
// Requests with no token or tokens referencing an unknown user are rejected.
//
// Use this in front of apis that can only be called by authenticated users.
const requireAuthenticatedUser = async (request, response, next) => {
    if (!request.token?.id) {
        return response
            .status(401)
            .json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(request.token.id);
    if (!user) {
        return response
            .status(401)
            .json({ error: 'token missing or invalid' });
    }

    request.user = user;

    next();
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    validateToken,
    requireAuthenticatedUser,
};