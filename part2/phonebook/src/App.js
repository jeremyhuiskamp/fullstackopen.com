import React, { useEffect, useState } from 'react';
import personService from './services/persons';

const errMsg = (e, person) => {
    if (person && personService.isNotExistingError(e)) {
        return `'${person.name}' doesn't exist.`;
    }

    const reason = e.response?.data?.error ?? e.message ?? e.toString();
    return `Unexpected error: ${reason}`
};

const Filter = ({ filter, setFilter }) =>
    <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>

const PersonForm = ({ persons, refreshPersons, notify }) => {
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const inputRef = React.createRef();

    const submit = (event) => {
        event.preventDefault();
        inputRef.current.focus();

        const reset = () => {
            setNewName('');
            setNewNumber('');
            refreshPersons();
        }

        const trimmed = newName.trim();
        if (trimmed === '') {
            return;
        }
        const existing = persons.find(p => p.name === trimmed);
        if (existing) {
            if (!window.confirm(`${existing.name} is already added to ` +
                `phonebook, replace old number with a new one?`)) {
                return;
            }
            personService
                .patch(existing.id, { number: newNumber.trim() })
                .then(() => notify(`Number updated for '${existing.name}'.`))
                .catch(e => notify(errMsg(e, existing), true))
                .then(reset);
            return;
        }

        personService
            .create(trimmed, newNumber.trim())
            .then(() => notify(`Added '${trimmed}'.`))
            .catch(e => notify(errMsg(e), true))
            .then(reset);
    };

    return (
        <form onSubmit={submit}>
            <div>
                name: <input ref={inputRef} autoFocus={true} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div>
                number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({ persons, filter, refreshPersons, notify }) => {
    const filteredPersons = persons.filter(p =>
        p.name.toLowerCase().includes(filter.trim().toLowerCase())
    )
    const drop = person => {
        if (!window.confirm(`Delete ${person.name}?`)) {
            return;
        }
        personService
            .delete(person.id)
            .then(() => notify(`'${person.name}' deleted.`))
            .catch(e => notify(errMsg(e, person), true))
            .then(refreshPersons);
    };
    return (
        <table>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Number</td>
                    <td>Delete</td>
                </tr>
            </thead>
            <tbody>
                {filteredPersons.map(p =>
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.number}</td>
                        <td>
                            <button
                                onClick={() => drop(p)}>
                                do it
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

const Notification = ({ msg, isError }) => {
    if (!msg) {
        return null;
    }

    const style = {
        color: isError ? "red" : "green",
    };
    return <div className="notification" style={style}>{msg}</div>
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState(null);
    const [notificationIsError, setNotificationIsError] = useState(false);
    const [notificationTimeout, setNotificationTimeout] = useState(null);

    const refreshPersons = () => {
        personService.getAll().then(setPersons);
    };

    useEffect(refreshPersons, []);

    const notify = (msg, isError = false) => {
        setNotification(msg);
        setNotificationIsError(isError);
        console.log(msg);

        // cancel previous timeout so that we don't wipe
        // this notification early...
        clearTimeout(notificationTimeout);
        setNotificationTimeout(setTimeout(() => {
            setNotification(null);
        }, 5000));
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification msg={notification} isError={notificationIsError} />

            <Filter filter={filter} setFilter={setFilter} />

            <h3>add a new</h3>
            <PersonForm
                persons={persons}
                refreshPersons={refreshPersons}
                notify={notify} />

            <h3>Numbers</h3>
            <Persons
                persons={persons}
                filter={filter}
                refreshPersons={refreshPersons}
                notify={notify} />
        </div>
    )
}

export default App