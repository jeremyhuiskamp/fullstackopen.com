import React from 'react';
import ReactDOM from 'react-dom';

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

const App = () => {
  const courses = [
    {
      id: 1,
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        },
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        },
      ]
    },
  ]

  return <>
    <h1>Web development curriculum</h1>
    {courses.map(course => <Course key={course.id} course={course} />)}
  </>
}

ReactDOM.render(<App />, document.getElementById('root'))