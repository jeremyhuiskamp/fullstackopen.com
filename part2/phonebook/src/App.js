import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filter, setFilter }) =>
    <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, tryNewName }) => {
    const inputRef = React.createRef()

    const submit = (e) => {
        e.preventDefault()
        inputRef.current.focus()

        tryNewName()
    }

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

const Persons = ({ persons, filter }) => {
    const filteredPersons = persons.filter(p =>
        p.name.toLowerCase().includes(filter.trim().toLowerCase())
    )
    return (
        <table>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Number</td>
                </tr>
            </thead>
            <tbody>
                {filteredPersons.map(p =>
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.number}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [filter, setFilter] = useState('')
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    useEffect(() => {
        axios.get('http://localhost:3001/persons')
            .then(rsp => {
                setPersons(rsp.data);
            });
    }, []);

    const tryNewName = () => {
        const trimmed = newName.trim()
        if (persons.some(p => p.name === trimmed)) {
            alert(`${trimmed} is already added to phonebook`)
            return
        }

        if (trimmed !== '') {
            setNewName('')
            setNewNumber('')
            const maxID = Math.max(...persons.map(p => p.id))
            setPersons([...persons, {
                name: trimmed,
                number: newNumber.trim(),
                id: maxID + 1
            }])
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>

            <Filter filter={filter} setFilter={setFilter} />

            <h3>add a new</h3>
            <PersonForm
                newName={newName} setNewName={setNewName}
                newNumber={newNumber} setNewNumber={setNewNumber}
                tryNewName={tryNewName} />

            <h3>Numbers</h3>
            <Persons persons={persons} filter={filter} />
        </div>
    )
}

export default App