const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
});

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Blog', blogSchema);