import Dropdown from "./Components/Dropdown/Dropdown.jsx"

function App() {
  
  const options = ["StraWberry", "banana", "Kiwi", "meLOn ", "APPLE"]

  const onChangeHandler = (val) => {
    console.log(val)
  }

  return (
    <div className="container">
      <Dropdown options={options} label="favorite fruit dropdown" autoFocus  onChange={onChangeHandler} clearable/>
    </div>
  )
}

export default App
