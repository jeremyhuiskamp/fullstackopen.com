import React, { useState } from 'react';
import loginService from '../services/login';

const Login = ({ user, setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState(null);

    const tryLogin = async event => {
        event.preventDefault();
        console.log('trying to log in...');

        try {
            setUser(await loginService.login(username, password));
            setUsername('');
            setPassword('');
            setErrMsg(null);
            console.log('logged in');
        } catch (e) {
            console.log(e.response?.data?.error ?? e);
            setErrMsg(`login failed: ${e.response?.data?.error}`);
        }
    };

    console.log('user', user);
    if (user) {
        return <div>
            Welcome {user.username}.
            &nbsp;
            <button onClick={() => setUser(null)}>Logout</button>
        </div >;
    }

    return <div>
        {errMsg && <div className="error">{errMsg}</div>}
        <form onSubmit={tryLogin}>
            <div>
                Username:
                &nbsp;
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={(e) => setUsername(e.target.value)}></input>
            </div>
            <div>
                Password:
                &nbsp;
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button type="submit">login</button>
        </form>
    </div>;
};

export default Login;