import React, { useEffect, useState } from 'react';
import './App.css';
import blogService from './services/blogs';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogCreator from './components/BlogCreator';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);

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
        <Login user={user} setUser={setUser} />
        {user &&
            <>
                <BlogCreator user={user} onBlogCreated={reloadBlogs} />
                <ul>
                    {blogs.map(blog => <li key={blog.id}><Blog blog={blog} /></li>)}
                </ul>
            </>}
    </>;
};

export default App;
