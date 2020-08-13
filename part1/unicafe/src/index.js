import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistic = ({ text, value, percentage = false }) => {
  if (percentage) {
    value = <>{value * 100} %</>
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, bad, neutral }) => {
  const allRatings = good + neutral + bad

  if (allRatings <= 0) {
    return <p>No feedback given</p>
  }

  const averageRating = (good - bad) / allRatings
  const positive = good / allRatings

  return (
    <table>
      <tbody>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={allRatings} />
        <Statistic text="average" value={averageRating} />
        <Statistic text="positive" value={positive} percentage={true} />
      </tbody>
    </table>
  )
}

const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementState = (value, setter) => () => {
    setter(value + 1)
  }

  return (
    <div>
      <h2>give feedback</h2>
      <p>
        <Button handleClick={incrementState(good, setGood)} text="good" />
        <Button handleClick={incrementState(neutral, setNeutral)} text="neutral" />
        <Button handleClick={incrementState(bad, setBad)} text="bad" />
      </p>
      <h2>statistics</h2>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)