const logger = require('./logger');

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

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};