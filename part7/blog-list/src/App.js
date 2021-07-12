import React, { useEffect, useRef } from 'react';
import {
    Link,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './App.css';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogCreator from './components/BlogCreator';
import Notification from './components/Notification';
import Toggle from './components/Toggle';
import Users from './components/Users';
import {
    likeBlog,
    refreshBlogs,
    removeBlog,
    createBlog,
} from './reducers/blogReducer';
import { refreshUsers } from './reducers/usersReducer';
import User from './components/User';

const App = () => {
    const history = useHistory();
    const toggleRef = useRef();

    const dispatch = useDispatch();
    const { blogs, user } = useSelector(state => state);

    useEffect(() => {
        dispatch(refreshBlogs());
        dispatch(refreshUsers());
    }, [user]);

    const create = async (title, author, url) => {
        dispatch(createBlog(title, author, url, user));
        toggleRef.current.hide();
    };

    const like = blog => {
        dispatch(likeBlog(blog.id, blog.likes + 1, user));
    };

    const remove = blog => {
        dispatch(removeBlog(blog, user));
        history.push('/');
    };

    const matchedUserId = useRouteMatch('/users/:id');
    const matchedBlogId = useRouteMatch('/blogs/:id');
    const matchedBlog = blogs.find(b => b.id === matchedBlogId?.params?.id);

    return <>
        {/* TODO: customise this per route? */}
        <h1>{user ?
            'Hello. Here are my blogs.' :
            'You must log in to see my blogs.'}</h1>

        <Notification />

        <Login />

        {user &&
            <Switch>
                <Route path='/users/:id'>
                    <User userId={matchedUserId?.params?.id} />
                </Route>
                <Route path='/users'>
                    <h2>Users</h2>
                    <Users />
                </Route>
                <Route path='/blogs/:id'>
                    <Blog
                        blog={matchedBlog}
                        like={like}
                        remove={matchedBlog?.user?.username === user.username ? remove : undefined} />
                </Route>
                <Route path='/'>
                    <Toggle buttonLabel="new blog" ref={toggleRef}>
                        <BlogCreator createBlog={create} />
                    </Toggle>

                    <ul id="blogs">
                        {blogs.map(blog =>
                            <li key={blog.id} className='blog'>
                                <Link to={`/blogs/${blog.id}`}>
                                    &quot;
                                    <span className='blogTitle'>{blog.title}</span>
                                    &quot; by <b>{blog.author}</b>
                                </Link>
                                &nbsp;&mdash;&nbsp;
                                {blog.likes} 👍
                            </li>
                        )}
                    </ul>
                </Route>
            </Switch>}
    </>;
};

export default App;
