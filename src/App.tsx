import React from "react"

import Dropdown from "./Components/deprecated/Dropdown/Dropdown"
import Select from "./Components/Select/Select"

function App() {
  
  const options = ["strawberry", "banana", "kiwi", "melon", "apple"]

  const onChangeHandler = (val:string) => {
    console.log(val)
  }

  return (
    <div className="container">
      <br/>
      <Select options={options} value="melon" label="favorite fruit" placeholder="favorite fruit"  clearable onChange={onChangeHandler}/>
      {/* <Dropdown options={options} label="favorite fruit dropdown" value="apple" autoFocus onChange={onChangeHandler}  clearable/> */}

    </div>
  )
}

export default App
