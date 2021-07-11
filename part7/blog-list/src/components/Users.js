import React from 'react';
import { useSelector } from 'react-redux';
import {
    Link,
} from 'react-router-dom';

const Users = () => {
    const users = useSelector(state => state.users);

    return <table>
        <thead>
            <tr>
                <th></th>
                <th>blogs created</th>
            </tr>
        </thead>
        <tbody>
            {
                users.map(user =>
                    <tr key={user.id}>
                        <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                        <td>{user.blogs?.length ?? 0}</td>
                    </tr>
                )
            }
        </tbody>
    </table>;
};

export default Users;