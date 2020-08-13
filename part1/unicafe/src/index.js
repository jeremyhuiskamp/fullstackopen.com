import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({ good, bad, neutral }) => {
  const allRatings = good + neutral + bad

  if (allRatings <= 0) {
    return <p>No feedback given</p>
  }

  const averageRating = (good - bad) / allRatings
  const positive = good / allRatings

  return (
    <>
      good {good}<br />
      neutral {neutral}<br />
      bad {bad}<br />
      all {allRatings}<br />
      average {averageRating}<br />
      positive {positive * 100} %
    </>
  )
}

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
        <button onClick={incrementState(good, setGood)}>good</button>
        <button onClick={incrementState(neutral, setNeutral)}>neutral</button>
        <button onClick={incrementState(bad, setBad)}>bad</button>
      </p>
      <h2>statistics</h2>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)