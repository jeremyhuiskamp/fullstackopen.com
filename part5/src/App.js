import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import blogService from './services/blogs';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogCreator from './components/BlogCreator';
import Notification from './components/Notification';
import Toggle from './components/Toggle';

const App = () => {
    const [blogs, _setBlogs] = useState([]);
    const setBlogs = blogs =>
        _setBlogs(blogs.sort((a, b) => b.likes - a.likes));

    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState(null);
    const toggleRef = useRef();

    // lower-level notification state setter:
    const doNotify = (msg, isError = false) => {
        if (notification) {
            clearTimeout(notification.timeout);
        }

        const newTimeout = setTimeout(() => {
            setNotification(null);
        }, 5000);

        setNotification({ msg, isError, timeout: newTimeout });
    };

    // higher-level notification api for components to use:
    const notify = {
        msg: (msg) => doNotify(msg),
        error: (msg) => doNotify(msg, true),
        clear: () => doNotify(null),
    };

    const reloadBlogs = () => {
        blogService.getAll().then(blogs => {
            setBlogs(blogs);
        });
    };

    useEffect(reloadBlogs, []);

    const createBlog = async (title, author, url) => {
        try {
            await blogService.create(title, author, url, user);
        } catch (e) {
            blogService.ifBadRequest(e, (msg) => {
                notify.error(msg);
            }, () => {
                throw e;
            });
            return;
        }

        notify.msg(`new blog "${title}" by "${author}" added`);

        toggleRef.current.hide();
        // don't just add the blog returned from the create call because it
        // doesn't populate the user the same as the get...
        reloadBlogs();
    };

    const like = blog => {
        blogService.like(blog.id, blog.likes + 1, user).then(() => {
            setBlogs(blogs.map(b => {
                if (b.id === blog.id) {
                    return { ...b, likes: b.likes + 1 };
                }
                return b;
            }));
        });
    };

    const remove = blog => {
        if (!window.confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)) {
            return;
        }
        blogService.remove(blog.id, user).then(() => {
            setBlogs(blogs.filter(b => b.id !== blog.id));
        });
    };

    return <>
        <h1>{user ?
            'Hello. Here are my blogs.' :
            'You must log in to see my blogs.'}</h1>

        <Notification notification={notification} />

        <Login user={user} setUser={setUser} notify={notify} />

        {user &&
            <>
                <Toggle buttonLabel="new blog" ref={toggleRef}>
                    <BlogCreator createBlog={createBlog} />
                </Toggle>

                {blogs.map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        like={like}
                        remove={blog.user.username === user.username ? remove : undefined} />)
                }
            </>}
    </>;
};

export default App;
