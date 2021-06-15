import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, loggedIn, tryLogin } from '../reducers/userReducer';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // Check local storage for existing user and register listener for future
    // changes:
    useEffect(() => {
        const checkForLoggedInUser = () => {
            const localStorageUser = localStorage.getItem('loggedInUser');
            if (localStorageUser) {
                console.log('found loggedInUser in local storage');
                dispatch(loggedIn(JSON.parse(localStorageUser)));
            } else {
                console.log('found no loggedInUser in local storage');
                dispatch(logout());
            }
        };
        checkForLoggedInUser();
        window.addEventListener('storage', () => {
            console.log('checking local storage for changes to loggedInUser');
            checkForLoggedInUser();
        });
    }, []);

    // Whenever the user changes, update local storage.
    // NB: this will fire after we dispatch(loggedIn) if we detect a change from
    // another tab, and we'll write the same value back to local storage.
    // Writing the same value back does not appear to trigger the event listener
    // in other tabs, but if it did, we'd probably trigger an infinite loop...
    useEffect(() => {
        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('loggedInUser');
        }
    }, [user]);

    const _tryLogin = async event => {
        event.preventDefault();

        dispatch(tryLogin(username, password));
        // can we delay the clearing of the form until we know if the login
        // succeeded?
        setUsername('');
        setPassword('');
    };

    if (user) {
        return <div>
            Welcome {user.username}.
            &nbsp;
            <button onClick={() => dispatch(logout())}>Logout</button>
        </div >;
    }

    return <div>
        <form onSubmit={_tryLogin}>
            <div>
                Username:
                &nbsp;
                <input
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={(e) => setUsername(e.target.value)}></input>
            </div>
            <div>
                Password:
                &nbsp;
                <input
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button type="submit" id="login">login</button>
        </form>
    </div>;
};

export default Login;