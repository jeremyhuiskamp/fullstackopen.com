import blogService from '../services/blogs';
import {
    setInfoNotification,
    setErrorNotification,
} from '../reducers/notificationReducer';

const sorted = blogs => blogs.sort((a, b) => b.likes - a.likes);

const reducer = (state = [], action) => {
    switch (action?.type) {
        case 'BLOGS_LOADED':
            return sorted([...action.data]);
        case 'BLOG_CREATED':
            // not used in prod, but by tests to populate the store:
            return sorted([...state, action.data]);
        case 'BLOG_LIKED': {
            const updated = state.map(
                blog => blog.id !== action.data.id ?
                    blog :
                    { ...blog, likes: action.data.likes }
            );
            return sorted(updated);
        }
        case 'BLOG_DELETED':
            return sorted(state.filter(blog => blog.id !== action.data));
    }
    return state;
};

const refreshBlogs = () => dispatch => {
    blogService.getAll().then(blogs => {
        dispatch({
            type: 'BLOGS_LOADED',
            data: blogs,
        });
    }).catch(e => {
        console.error(`failed to fetch initial blogs: ${e}`);
        dispatch(setErrorNotification('fetching blogs failed'));
    });
};

const createBlog = (title, author, url, user) => dispatch => {
    blogService.create(title, author, url, user).then(_ => {
        // don't just add the blog returned from the create call because it
        // doesn't populate the user the same as the get...
        dispatch(refreshBlogs());
        dispatch(setInfoNotification(`new blog "${title}" by "${author}" added`));
    }).catch(e => {
        blogService.ifBadRequest(e, (msg) => {
            dispatch(setErrorNotification(msg));
        }, () => {
            console.error(`failed to create blog: ${e}`);
            dispatch(setErrorNotification('creating blog failed'));
        });
    });
};

const likeBlog = (id, likes, user) => dispatch => {
    blogService.like(id, likes, user).then(() => {
        dispatch({
            type: 'BLOG_LIKED',
            data: {
                id,
                likes,
            }
        });
    }).catch(e => {
        console.error(`failed to like blog: ${e}`);
        dispatch(setErrorNotification('liking blog failed'));
    });
};

const removeBlog = (blog, user) => dispatch => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)) {
        return;
    }

    blogService.remove(blog.id, user).then(() => {
        dispatch({
            type: 'BLOG_DELETED',
            data: blog.id,
        });
    }).catch(e => {
        console.error(`failed to delete blog: ${e}`);
        dispatch(setErrorNotification('deleting blog failed'));
    });
};

export {
    reducer,
    refreshBlogs,
    createBlog,
    likeBlog,
    removeBlog,
};