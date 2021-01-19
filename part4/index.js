const config = require('./utils/config');
const logger = require('./utils/logger');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogsRouter = require('./controllers/blogs');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});