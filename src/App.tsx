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
      {/* <Dropdown options={options} label="favorite fruit dropdown" value="apple" autoFocus onChange={onChangeHandler}  clearable/> */}
      <br/>
      <Select options={options}  label="Favorite fruit" value="kiwi" clearable onChange={onChangeHandler}/>
    </div>
  )
}

export default App
