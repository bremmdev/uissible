import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./Dropdown.module.css";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
  IoMdClose,
} from "react-icons/io";

const formatText = (x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`

const Dropdown = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const prevSelectedOptionRef = useRef(null);
  const dropDownRef = useRef(null)
 
  const { value, placeholder, onChange, id, autoFocus, label, clearable } = props;

  //format and sort options and memoize the result
  const options = useMemo(() => props.options.map((v) => v.trim().toLowerCase()).sort(), [props.options])

  //optional id for list of options, used for ARIA
  const listId = id || null;

  const toggleOptions = () => {
    setShowOptions((prevState) => !prevState);
  };

  const clearSelection = (e) => {
    e.stopPropagation(); //prevents opening the dropdown again
    setSelectedOption(null);
    setShowOptions(false);
  };

  const changeSelectedOption = (index, shouldCollapse = true) => {
    setSelectedOption(index);

    if(shouldCollapse){
      setShowOptions(false);
    }
    else{
      setShowOptions(true)
    }
    
    //expose value on onChange prop
    onChange(options[index]);
  };
  
  //expand dropdown and select first option
  const handleButtonKeyDown = (e) => {
    if(e.code === 'ArrowDown'){
      e.preventDefault()
      changeSelectedOption(0, false)
    }

    if(e.code === 'ArrowUp'){
      e.preventDefault()
      changeSelectedOption(options.length-1, false)
    }
  }

  const handleClearBtnKeyDown = (e) => {
    if(e.code === 'Enter' || e.code === 'Space'){
      e.preventDefault()
      clearSelection(e)
    }
  }

  const handleOptionKeyDown = (e, idx) => {
    if(e.code === 'Escape'){
      e.preventDefault()
      setShowOptions(false)
      return
    }
    if(e.code === 'Enter' || e.code === 'Space' || e.code === 'Tab'){
      e.preventDefault()
      changeSelectedOption(idx)
      return
    }

    if(e.code === 'ArrowDown'){
      e.preventDefault()
      const newSelectedOption = selectedOption + 1 > options.length - 1 ? 0 : selectedOption + 1
      changeSelectedOption(newSelectedOption, false)
      return 
    }

    if(e.code === 'ArrowUp'){
      e.preventDefault()
      const newSelectedOption = selectedOption - 1 < 0 ? options.length - 1 : selectedOption + -1
      changeSelectedOption(newSelectedOption, false) 
      return
    }
  }

  //store the previous selected option. Needed because we only animate placeholder text 
  //when clearing the input, not on first mount
  useEffect(() => {
    prevSelectedOptionRef.current = selectedOption;
  }, [selectedOption]);

  //focus management for options
  useEffect(() => {
    if(selectedOption !== null){
      const listElements = [...dropDownRef.current.querySelectorAll('li')]
      if(listElements && listElements.length > 0)
      listElements[selectedOption].focus()
    }
  }, [selectedOption]);

  useEffect(() => {
    if (value) {
      const existingIdx = options.findIndex(option => option === value.trim().toLowerCase())
      if (existingIdx !== -1) {
        setSelectedOption(existingIdx);
      }
    }
  }, [value]);

  let btnClasses = styles.btn;

  //fade in placeholder if we clear the input
  if (selectedOption === null && prevSelectedOptionRef.current !== null) {
    btnClasses = `${styles.btn} ${styles.fade}`;
  }

  const buttonText =
    selectedOption !== null
      ? options[selectedOption]
      : placeholder
      ? placeholder
      : "Please choose an option";

  const ARIALabelText =
    label && selectedOption !== null
      ? `${label}. selected option is ${options[selectedOption]}. Use the arrow keys to go through the options. Press Tab Space or Enter to select an option`
      : label
      ? `${label}. no option selected. Use the arrow keys to go through the options. Press Tab Space or Enter to select an option`
      : null;  

  const optionsList = (
    <ul
      role="listbox"
      id={listId}
      tabIndex={-1}
      aria-activedescendant={options[selectedOption]}
    >
      {showOptions &&
        options.map((option, idx) => (
          <li
            key={option}
            role="option"
            aria-selected={selectedOption === idx}
            tabIndex={0}
            onKeyDown={(e) => handleOptionKeyDown(e, idx)}
            onClick={() => changeSelectedOption(idx)}
          >
            {formatText(option)}
          </li>
        ))}
    </ul>
  );
  

  return (
    <div className={styles.dropdown} ref={dropDownRef}> 
      <button
        className={btnClasses}
        type="button"
        autoFocus={autoFocus}
        aria-expanded={showOptions}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={ARIALabelText} 
        onClick={toggleOptions}
        onKeyDown={handleButtonKeyDown}
      >
        {formatText(buttonText)}
        <div className={styles["btn-actions"]}>
          {selectedOption !== null && clearable && (
            <IoMdClose
              role="button"
              onClick={clearSelection}
              aria-label="clear input"
              tabIndex={0}
              onKeyDown={handleClearBtnKeyDown}
              size="1.5rem"
              className={styles["clear-icon"]}
            />
          )}
          {showOptions ? (
            <IoIosArrowDropup size="1.5rem" />
          ) : (
            <IoIosArrowDropdown size="1.5rem" />
          )}
        </div>
      </button>
      {optionsList}
    </div>
  );
};

export default Dropdown;
