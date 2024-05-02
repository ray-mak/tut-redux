import { useSelector, useDispatch } from "react-redux"
import { increment, decrement, reset, incrementByAmount } from "./counterSlice"
import { useState } from "react"

const Counter = () => {
    const count = useSelector((state) => state.counter.count) //counter refers to name in counterSlice variable, count refers to count in initialState from counterSlice variable.
    const dispatch = useDispatch()  //hook used to dispatch function from Redux store
    const [incrementAmount, setIncrementAmount] = useState(0)
    const addValue = Number(incrementAmount) || 0   //verify we get number value, if not a number will get 0
    const resetAll = () => {
        setIncrementAmount(0)
        dispatch(reset())
    }

  return (
    <section>
        <p>{count}</p>
        <div>
            <button onClick={() => {dispatch(increment())}}>+</button>
            <button onClick={() => {dispatch(decrement())}}>-</button>
        </div>

        <input
            type="number"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <div>
            <button onClick={() => dispatch(incrementByAmount(addValue))}>Add Amount</button>
            <button onClick={resetAll}>Reset</button>
        </div>
    </section>
  )
}

//When calling "dispatch(incrementByAmount(addValue))" Redux Toolkit automatically wraps 'addValue' into action object with payload set to 'addValue'. This is what the action object looks like:
//      {
//          type: "counter/incrementByAmount",
//          payload: addValue
//      }

//The type field is a string that gives a descriptive name. Usually written like "domain/eventName". (First part is the feature or category that the action belongs to). The 'state' parameter is automatically provided by Redux

export default Counter