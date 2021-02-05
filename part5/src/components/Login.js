import React, { useState, useEffect } from 'react';
import loginService from '../services/login';

const Login = ({ user, setUser, notify }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Check local storage for existing user and register listener for future
    // changes:
    useEffect(() => {
        const checkForLoggedInUser = () => {
            const localStorageUser = localStorage.getItem('loggedInUser');
            if (localStorageUser) {
                console.log('found loggedInUser in local storage');
                setUser(JSON.parse(localStorageUser));
            } else {
                console.log('found no loggedInUser in local storage');
                setUser(null);
            }
        };
        checkForLoggedInUser();
        window.addEventListener('storage', () => {
            console.log('checking local storage for changes to loggedInUser');
            checkForLoggedInUser();
        });
    }, []);

    // Whenever the user changes, update local storage.
    // NB: this will fire after we setUser if we detect a change from another
    // tab, and we'll write the same value back to local storage.  Writing the
    // same value back does not appear to trigger the event listener in other
    // tabs, but if it did, we'd probably trigger an infinite loop...
    useEffect(() => {
        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('loggedInUser');
        }
    }, [user]);

    const tryLogin = async event => {
        event.preventDefault();
        console.log('trying to log in...');

        try {
            setUser(await loginService.login(username, password));
            setUsername('');
            setPassword('');
            console.log('logged in');
            notify.clear();
        } catch (e) {
            console.log(e.response?.data?.error ?? e);
            notify.error(`login failed: ${e.response?.data?.error}`);
        }
    };

    if (user) {
        return <div>
            Welcome {user.username}.
            &nbsp;
            <button onClick={() => setUser(null)}>Logout</button>
        </div >;
    }

    return <div>
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