import React, { useState, useRef, useEffect } from "react";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
  IoMdClose,
  IoMdCheckmark
} from "react-icons/io";
import styles from "./Select.module.css";

type Props = {
  autoFocus?: boolean;
  clearable?: boolean;
  id?: string;
  label?: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  value?: string;
};

const formatText = (x: string) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

const determineSelectedOption = (value: string | undefined, options: string[]) => {
  if (!value) return null;
  const existingIdx = options.findIndex(
    (option) => option === value.trim().toLowerCase()
  );
  return existingIdx === -1 ? null : existingIdx;
} 

const Select = (props: Props) => {
  const { autoFocus, clearable, id, label, onChange, placeholder, value } = props;

  //format and sort options
  const options = props.options.map((v) => v.trim().toLowerCase()).sort();

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(determineSelectedOption(value, options));
  const [focusedOption, setFocusedOption] = useState<number | null>(null)

  const selectInputRef = useRef<HTMLDivElement>(null);
  const listOptionsRef = useRef<HTMLDivElement>(null)
  const prevSelectedOptionRef = useRef<number | null>(null);

  //optional id for list of options, used for ARIA
  const listId = id;

  const toggleOptions = () => {
    setShowOptions((prevState) => !prevState);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation(); //prevents opening the dropdown again
    setSelectedOption(null);
    setShowOptions(false);
  };

  const changeSelectedOption = (index:number, shouldCollapse = true) => {
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

  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    //do not prevent tabbing through elements
    if(!(e.key == 'Tab' && !showOptions)){
      e.preventDefault()
    }
    const openKeys = ['Space', 'Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End']
    const selectKeys = ['Space', 'Enter', ' ', 'Tab']
    console.log(e.key)

    //collapsed state
    if (!showOptions) {
      if (openKeys.includes(e.key)) {
        setShowOptions(true);
        setFocusedOption(selectedOption ?? null);

        if (e.key === "Home" || e.key === "End") {
          const newIdx = e.key === "Home" ? 0 : options.length - 1;
          setFocusedOption(newIdx);
        }
      }
    }
    //expanded state
    else {
      const hasFocusedOption = focusedOption !== null;
      const hasSelectedOption = selectedOption !== null;
      const max = options.length - 1;

      if (e.code === "Escape") {
        setShowOptions(false);
        return;
      }

      if (selectKeys.includes(e.code)) {
        changeSelectedOption(focusedOption!);
        return;
      }

      if (e.code === "ArrowDown") {
        console.log(focusedOption, selectedOption);

        const newIdx = hasFocusedOption
          ? focusedOption + 1 > max
            ? 0
            : focusedOption + 1
          : hasSelectedOption
          ? selectedOption! + 1 > max
            ? 0
            : selectedOption! + 1
          : 0;

        setFocusedOption(newIdx);
        return;
      }

      if (e.code === "ArrowUp") {
        const newIdx = hasFocusedOption
          ? focusedOption - 1 < 0
            ? max
            : focusedOption - 1
          : hasSelectedOption
          ? selectedOption! - 1 < 0
            ? max
            : selectedOption! - 1
          : max;

        setFocusedOption(newIdx);
        return;
      }

      if (e.code === "Home" || e.code === "End") {
        const newIdx = e.key === "Home" ? 0 : max;
        setFocusedOption(newIdx);
        return;
      }
    }

     
     //@TODO printable characters
  }

  useEffect(() => {
    if (autoFocus) {
      selectInputRef.current?.focus();
    }
  }, []);

  //store the previous selected option. Needed because we only animate placeholder text
  //when clearing the input, not on first mount
  useEffect(() => {
    prevSelectedOptionRef.current = selectedOption;
  }, [selectedOption]);

  let selectControlClasses = styles.select__control;

  //fade in placeholder if we clear the input
  if (selectedOption === null && prevSelectedOptionRef.current !== null) {
    selectControlClasses = `${styles.select__control} ${styles.fade}`;
  }

  //text for select control
  const selectText =
    selectedOption !== null
      ? options[selectedOption]
      : placeholder
      ? placeholder
      : "Please choose an option";

  const doRenderClearButton: boolean = selectedOption !== null && clearable ? true : false;

  //menu container and list of options
  const listOptions = showOptions && (
    <div
      className={styles.select__menu}
      ref={listOptionsRef}
      role="listbox"
      aria-labelledby="select__label"   
      tabIndex={-1}
      id={listId}
     
    >
      {options.map((option, idx) => (
        <div
          role="option"
          tabIndex={0}
          key={option}
          className={focusedOption === idx ? `${styles.select__option} ${styles['current-option']}` : `${styles.select__option}`}
          aria-selected={selectedOption === idx}
          id={`option_${idx}`}
          onClick={() => changeSelectedOption(idx)}
        >
          <span>{formatText(option)}</span>{selectedOption === idx && <IoMdCheckmark size="1.5rem"/>}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.select__container}>
     {label && <label id="select__label" hidden>{`${label}.`}</label>}
     <div id="select__instructions" hidden>Use the arrow keys to go through the options. Press Tab Space or Enter to select an option and close the menu</div>
      <div
        className={selectControlClasses}
        onClick={toggleOptions}
        onKeyDown={handleSelectKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showOptions}
        aria-labelledby="select__label"
        aria-describedby="select__instructions"
        aria-activedescendant={`option_${focusedOption}`}
        aria-controls={listId}
        tabIndex={0}
        ref={selectInputRef}
      >
        <div id="select__value" className={styles.select__value}>{formatText(selectText)}</div>
        <div className={styles.select__actions}>
          {doRenderClearButton && (
            <IoMdClose
              className={styles.select__clear}
              role="button"
              size="1.5rem"
              onClick={clearSelection}
              tabIndex={0}
              aria-label="clear input"
            />
          )}
          {showOptions ? (
            <IoIosArrowDropup size="1.5rem" />
          ) : (
            <IoIosArrowDropdown size="1.5rem" />
          )}
        </div>
      </div>
      {listOptions}
    </div>
  );
};

export default Select;
