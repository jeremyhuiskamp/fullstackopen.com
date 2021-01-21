const _ = require('lodash');

// chooseBest returns the best thing from things, using chooseFunc to choose
// between any two things.  If there is only 1 thing, it is the best.  If
// there are zero things, the best is undefined.
const chooseBest = (things, chooseFunc) =>
    things.reduce((a, b) => a === undefined ? b : chooseFunc(a, b), undefined);

// bestAuthor takes a function that picks an interesting field from an author
// and returns a function that chooses which of two authors have the higher
// value for that field.  Ties are broken by comparing author names.
const chooseAuthorBy = fieldChooser => (author1, author2) => {
    const field1 = fieldChooser(author1);
    const field2 = fieldChooser(author2);

    if (field1 > field2) {
        return author1;
    } else if (field2 > field1) {
        return author2;
    } else if (author1.author < author2.author) {
        return author1;
    } else {
        return author2;
    }
};

// returns f(thing) if thing is defined, otherwise undefined.
const maybeMap = (thing, f) =>
    thing === undefined ? undefined : f(thing);

const totalLikes = blogs => _.sumBy(blogs, b => b.likes);

const favouriteBlog = blogs => {
    const blog = chooseBest(blogs, (b1, b2) => b1.likes > b2.likes ? b1 : b2);
    return maybeMap(blog, blog => ({
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
    }));
};

const mostBlogs = blogs => {
    // { "author1": 1, "author2": 2 }
    const counted = _.countBy(blogs, b => b.author);

    // [ { author: "author1", blogs: 1 }, { author: "author2", blogs: 2 } ]
    const authors = _.toPairs(counted).map(([author, blogs]) => ({ author, blogs }));

    return chooseBest(authors, chooseAuthorBy(a => a.blogs));
};

const mostLikes = blogs => {
    // { "author1": [ ... blogs ... ], "author2": [ ... blogs ... ] }
    const grouped = _.groupBy(blogs, b => b.author);

    // [ { author: "author1", likes: 1 }, { author: "author2", likes: 2 } ]
    const authors = _.toPairs(grouped).map(([author, authorsBlogs]) => ({
        author,
        likes: totalLikes(authorsBlogs),
    }));

    return chooseBest(authors, chooseAuthorBy(a => a.likes));
};

module.exports = {
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes,
};