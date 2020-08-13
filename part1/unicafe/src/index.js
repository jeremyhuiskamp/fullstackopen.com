import React, { useState } from 'react'
import ReactDOM from 'react-dom'

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
      good {good}<br />
      neutral {neutral}<br />
      bad {bad}
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)