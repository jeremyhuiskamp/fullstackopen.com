import React, { useState } from 'react'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas' }
    ])
    const [newName, setNewName] = useState('')
    const inputRef = React.createRef()

    const submit = (e) => {
        e.preventDefault();
        inputRef.current.focus();

        const trimmed = newName.trim()
        if (persons.some(p => p.name === trimmed)) {
            alert(`${trimmed} is already added to phonebook`)
            return
        }

        setNewName('')
        if (trimmed !== '') {
            setPersons([...persons, { name: trimmed }])
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={submit}>
                <div>
                    name: <input ref={inputRef} autofocus="true" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <ul>
                {persons.map(p => <li key={p.name}>{p.name}</li>)}
            </ul>
        </div>
    )
}

export default App