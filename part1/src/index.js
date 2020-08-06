import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => <h1>{props.course}</h1>

const Part = (props) =>
  <tr>
    <td>{props.name}</td>
    <td>{props.exercises}</td>
  </tr>


const Content = (props) =>
  <table>
    <tbody>
      {props.parts.map(p => <Part key={p.name} name={p.name} exercises={p.exercises} />)}
    </tbody>
  </table>

const Total = (props) =>
  <p>Number of exercises: {props.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10,
    },
    {
      name: 'Using props to pass data',
      exercises: 7,
    },
    {
      name: 'State of a component',
      exercises: 14,
    },
  ]

  return (
    <>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))