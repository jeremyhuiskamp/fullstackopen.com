import React, { useEffect, useState } from 'react';
import './App.css';
import blogService from './services/blogs';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogCreator from './components/BlogCreator';
import Notification from './components/Notification';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState(null);

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

    return <>
        <h1>{user ?
            'Hello. Here are my blogs.' :
            'You must log in to see my blogs.'}</h1>

        <Notification notification={notification} />

        <Login user={user} setUser={setUser} notify={notify} />

        {user &&
            <>
                <BlogCreator user={user} onBlogCreated={reloadBlogs} notify={notify} />
                <ul>
                    {blogs.map(blog => <li key={blog.id}><Blog blog={blog} /></li>)}
                </ul>
            </>}
    </>;
};

export default App;
