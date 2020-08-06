import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => <h1>{props.course.name}</h1>

const Part = (props) =>
  <tr>
    <td>{props.part.name}</td>
    <td>{props.part.exercises}</td>
  </tr>


const Content = (props) =>
  <table>
    <tbody>
      {props.course.parts.map(p => <Part key={p.name} part={p} />)}
    </tbody>
  </table>

const Total = (props) =>
  <p>Number of exercises: {props.course.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
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
    ],
  }

  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))