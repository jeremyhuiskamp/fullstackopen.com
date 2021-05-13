import React, { useState } from 'react';
import {
    NavLink,
    Link,
    Route,
    Switch,
    useRouteMatch,
    useHistory,
} from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
const uuid = require('uuid');
import { useField } from './hooks';

const Menu = () => {
    const activeStyle = {
        fontWeight: 'bold',
    };
    return <ul className="navigation">
        <li><NavLink activeStyle={activeStyle} exact data-testid='link-aphorisms' to='/'>Aphorisms</NavLink></li>
        <li><NavLink activeStyle={activeStyle} data-testid='link-create' to='/create'>Create New</NavLink></li>
        <li><NavLink activeStyle={activeStyle} data-testid='link-about' to='/about'>About</NavLink></li>
    </ul>;
};

const Notification = ({ content }) => {
    if (content) {
        return <p role='status'>{content}</p>;
    }
    return <></>;
};

Notification.propTypes = {
    content: PropTypes.string,
};

const Aphorisms = ({ aphorisms }) => {
    return <div data-testid='aphorisms'>
        <h2>Aphorisms</h2>
        <ul>
            {aphorisms.map(aphorism => <li key={aphorism.id}>
                <Link to={`/aphorisms/${aphorism.id}`}>{aphorism.content}</Link>
            </li>)}
        </ul>
    </div>;
};

Aphorisms.propTypes = {
    aphorisms: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
    })),
};

const Aphorism = ({ aphorism }) => {
    if (!aphorism) {
        return <h2>No such aphorism!</h2>;
    }
    return <div data-testid='aphorism'>
        <h2>{aphorism.content} by {aphorism.author}</h2>
        <p>has {aphorism.votes} vote(s)</p>
        <p>for more info see <a href={aphorism.info}>{aphorism.info}</a></p>
    </div>;
};

Aphorism.propTypes = {
    aphorism: PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
        author: PropTypes.string,
        info: PropTypes.string,
        votes: PropTypes.number,
    }),
};

const CreateAphorism = ({ addNew }) => {
    const content = useField('text');
    const author = useField('text');
    const info = useField('text');

    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        addNew({
            content: content.input.value,
            author: author.input.value,
            info: info.input.value,
            votes: 0,
        });

        history.push('/');
    };

    const clear = (e) => {
        e.preventDefault();
        content.reset();
        author.reset();
        info.reset();
    };

    return <div data-testid='create-aphorism'>
        <h2>Add a new aphorism</h2>
        <form onSubmit={handleSubmit}>
            <label>
                content:&nbsp;
                <input {...content.input} />
            </label>
            <br />
            <label>
                author:&nbsp;
                <input {...author.input} />
            </label>
            <br />
            <label>
                url for more info:&nbsp;
                <input {...info.input} />
            </label>
            <br />
            <button>create</button>
            <button onClick={clear}>clear</button>
        </form>
        <br />
    </div>;
};

CreateAphorism.propTypes = {
    addNew: PropTypes.func,
};

const About = () => (
    <div data-testid='about'>
        <h2>About aphorism app</h2>
        <p>According to Wikipedia:</p>

        <em>
            An aphorism is a concise, terse, laconic, or memorable expression of a general truth
            or principle.
            They are often handed down by tradition from generation to generation.
            The concept is distinct from those of an adage, brocard, chiasmus, epigram,
            maxim (legal or philosophical), principle, proverb, and saying; some of these
            concepts are types of aphorism.
        </em>

        <p>Software engineering is full of excellent aphorisms, at this app you can find the best and add more.</p>
    </div>
);

const Footer = () => {
    return <>
        <hr />
        <p data-testid='footer'>
            Aphorism app for <a href='https://fullstackopen.com/en/part7/react_router'>Full Stack open, part 7</a>.
        </p>
    </>;
};

// App should be rendered within a <Router> of some sort.
const App = () => {
    const [aphorisms, setAphorisms] = useState([{
        content: 'If it hurts, do it more often',
        author: 'Jez Humble',
        info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
        votes: 0,
        id: '1'
    }, {
        content: 'Premature optimization is the root of all evil',
        author: 'Donald Knuth',
        info: 'http://wiki.c2.com/?PrematureOptimization',
        votes: 0,
        id: '2'
    }]);

    const [notification, setNotification] = useState({});

    const addNew = (aphorism) => {
        aphorism = { ...aphorism, id: uuid.v4() };
        setAphorisms(aphorisms.concat(aphorism));

        clearTimeout(notification.timer);
        setNotification({
            timer: setTimeout(() => setNotification({}), 10000),
            content: `new anecdote created: ${aphorism.content}`,
        });
    };

    const matchedAphorism = useRouteMatch('/aphorisms/:id');
    const displayedAphorism = aphorisms.find(a => a.id === matchedAphorism?.params?.id);

    return (
        <>
            <h1>Software aphorisms</h1>
            <Menu />
            <Notification content={notification.content} />

            <Switch>
                <Route path='/create'>
                    {/* Hmm, the form seems to be lost when we navigate away and back? */}
                    <CreateAphorism addNew={addNew} />
                </Route>
                <Route path='/about'>
                    <About />
                </Route>
                <Route path='/aphorisms/:id'>
                    <Aphorism aphorism={displayedAphorism} />
                </Route>
                <Route path='/'>
                    <Aphorisms aphorisms={aphorisms} />
                </Route>
            </Switch>

            <Footer />
        </>
    );
};

export default App;
