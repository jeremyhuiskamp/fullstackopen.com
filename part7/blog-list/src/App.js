import React, { useEffect, useRef } from 'react';
import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
    };

    const matchedUserId = useRouteMatch('/users/:id');

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
                <Route path='/'>
                    <Toggle buttonLabel="new blog" ref={toggleRef}>
                        <BlogCreator createBlog={create} />
                    </Toggle>

                    <div id="blogs">
                        {blogs.map(blog =>
                            <Blog
                                key={blog.id}
                                blog={blog}
                                like={like}
                                remove={blog.user?.username === user.username ? remove : undefined} />)
                        }
                    </div>
                </Route>
            </Switch>}
    </>;
};

export default App;
