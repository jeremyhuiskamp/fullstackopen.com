const _ = require('lodash');

const totalLikes = blogs =>
    blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favouriteBlog = blogs =>
    blogs.reduce((fave, blog) => fave?.likes > blog.likes ? fave : {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
    }, undefined);

// chooseBest returns the best thing from things, using chooseFunc to choose
// between any two things.  If there is only 1 thing, it is the best.  If
// there are zero things, the best is undefined.
const chooseBest = (things, chooseFunc) =>
    things.reduce((a, b) => a === undefined ? b : chooseFunc(a, b), undefined);

const mostBlogs = blogs => {
    // { "author1": 1, "author2": 2 }
    const counted = _.countBy(blogs, b => b.author);

    // [ { author: "author1", blogs: 1 }, { author: "author2", blogs: 2 } ]
    const authors = _.toPairs(counted).map(([author, blogs]) => ({ author, blogs }));

    return chooseBest(authors, (a1, a2) => {
        if (a1.blogs > a2.blogs) {
            return a1;
        } else if (a2.blogs > a1.blogs) {
            return a2;
        } else if (a1.author < a2.author) {
            return a1;
        } else {
            return a2;
        }
    });
};

module.exports = {
    totalLikes,
    favouriteBlog,
    mostBlogs,
};