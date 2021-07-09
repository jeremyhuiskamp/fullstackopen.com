import React from 'react';
import { useSelector } from 'react-redux';

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
                        <td>{user.name}</td>
                        <td>{user.blogs?.length ?? 0}</td>
                    </tr>
                )
            }
        </tbody>
    </table>;
};

export default Users;