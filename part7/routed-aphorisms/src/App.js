import React, { useState } from 'react';
import {
    NavLink,
    Route,
    Switch,
} from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types';
const uuid = require('uuid');

const Menu = () => {
    return <ul className="navigation">
        <li><NavLink data-testid='link-aphorisms' to='/'>Aphorisms</NavLink></li>
        <li><NavLink data-testid='link-create' to='/create'>Create New</NavLink></li>
        <li><NavLink data-testid='link-about' to='/about'>About</NavLink></li>
    </ul>;
};

const Aphorisms = ({ aphorisms }) => {
    return <div data-testid='aphorisms'>
        <h2>Aphorisms</h2>
        <ul>
            {aphorisms.map(aphorism => <li key={aphorism.id}>{aphorism.content}</li>)}
        </ul>
    </div>;
};

Aphorisms.propTypes = {
    aphorisms: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
    })),
};

const CreateAphorism = ({ addNew }) => {
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [info, setInfo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addNew({
            content,
            author,
            info,
            votes: 0,
        });
        setContent('');
        setAuthor('');
        setInfo('');
    };

    return <div data-testid='create-aphorism'>
        <h2>Add a new aphorism</h2>
        <form onSubmit={handleSubmit}>
            <label>
                content:&nbsp;
                <input
                    name='content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)} />
            </label>
            <br />
            <label>
                author:&nbsp;
                <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
            </label>
            <br />
            <label>
                url for more info:&nbsp;
                <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
            </label>
            <br />
            <button>create</button>
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

    const addNew = (aphorism) => {
        aphorism = { ...aphorism, id: uuid.v4() };
        setAphorisms(aphorisms.concat(aphorism));
    };

    return (
        <>
            <h1>Software aphorisms</h1>
            <Menu />

            <Switch>
                <Route path='/create'>
                    {/* Hmm, the form seems to be lost when we navigate away and back? */}
                    <CreateAphorism addNew={addNew} />
                </Route>
                <Route path='/about'>
                    <About />
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
