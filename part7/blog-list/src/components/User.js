import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const User = ({ userId }) => {
    const users = useSelector(state => state.users);
    const user = users.find(u => u.id === userId);

    if (users.length === 0) {
        // presumably not loaded yet:
        return <p>loading...</p>;
    }

    if (!user) {
        console.log('unknown user', userId);
        return <h2>Unknown user &quot;{userId}&quot;</h2>;
    }

    return <>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
            {user.blogs.map(blog =>
                <li key={blog.id}>{blog.title}</li>
            )}
        </ul>
    </>;
};

User.propTypes = {
    userId: PropTypes.string,
};

export default User;