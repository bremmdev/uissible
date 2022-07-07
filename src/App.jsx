import React from "react"

import Dropdown from "./Components/Dropdown/Dropdown.jsx"

function App() {
  
  const options = ["strawberry", "banana", "kiwi", "melon", "apple"]

  const onChangeHandler = (val) => {
    console.log(val)
  }

  return (
    <div className="container">
      <Dropdown options={options} label="favorite fruit dropdown" autoFocus onChange={onChangeHandler}  clearable/>
    </div>
  )
}

export default App
