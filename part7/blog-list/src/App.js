import React, { useEffect, useRef } from 'react';
import './App.css';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogCreator from './components/BlogCreator';
import Notification from './components/Notification';
import Toggle from './components/Toggle';
import { useDispatch, useSelector } from 'react-redux';
import {
    likeBlog,
    refreshBlogs,
    removeBlog,
    createBlog,
} from './reducers/blogReducer';

const App = () => {
    const toggleRef = useRef();

    const dispatch = useDispatch();
    const { blogs, user } = useSelector(state => state);

    useEffect(() => {
        dispatch(refreshBlogs());
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

    return <>
        <h1>{user ?
            'Hello. Here are my blogs.' :
            'You must log in to see my blogs.'}</h1>

        <Notification />

        <Login />

        {user &&
            <>
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
            </>}
    </>;
};

export default App;
