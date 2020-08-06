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
  <p>Number of exercises: {props.parts.map(p => p.exercises).reduce((a, b) => a + b)}</p>

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts = [
    { name: part1, exercises: exercises1 },
    { name: part2, exercises: exercises2 },
    { name: part3, exercises: exercises3 },
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