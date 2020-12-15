import React, { useState } from 'react'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '1234567' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const inputRef = React.createRef()

    const submit = (e) => {
        e.preventDefault();
        inputRef.current.focus();

        const trimmed = newName.trim()
        if (persons.some(p => p.name === trimmed)) {
            alert(`${trimmed} is already added to phonebook`)
            return
        }

        if (trimmed !== '') {
            setNewName('')
            setNewNumber('')
            setPersons([...persons, { name: trimmed, number: newNumber.trim() }])
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
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
            <h2>Numbers</h2>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Number</td>
                    </tr>
                </thead>
                <tbody>
                    {persons.map(p =>
                        <tr key={p.name}>
                            <td>{p.name}</td>
                            <td>{p.number}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default App