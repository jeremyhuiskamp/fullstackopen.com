import React from 'react'

const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ name, exercises }) =>
    <tr>
        <td>{name}</td>
        <td>{exercises}</td>
    </tr>

const Content = ({ parts }) =>
    <table>
        <tbody>
            {parts.map(p => <Part key={p.id} name={p.name} exercises={p.exercises} />)}
        </tbody>
    </table>

const Total = ({ parts }) =>
    <p>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</p>

const Course = ({ course }) => <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
</>

export default Course