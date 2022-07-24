import { describe, it, expect, vi } from "vitest";
import { screen, render, userEvent } from "../../../test-utils";
import Select from "./Select";
import React from "react"

describe("Select", () => {

    const onChange = vi.fn()
    const testOptions = ["apple", "banana", "kiwi"]

    describe("Select control", () => {
      it('should be focused if autoFocus prop is set', () => {
        render(<Select onChange={onChange} autoFocus options={testOptions}/>)
        expect(screen.getByRole('combobox')).toHaveFocus()
      })

      it('should NOT be focused if autoFocus prop is NOT set', () => {
        render(<Select onChange={onChange} options={testOptions}/>)
        expect(screen.getByRole('combobox')).not.toHaveFocus()
      })

      it('should render', () => {
        render(<Select onChange={onChange} options={testOptions}/>)
        expect(screen.getByRole('combobox')).toBeInTheDocument()
      })

      it('should render default placeholder if there is no placeholder prop', () => {
        render(<Select onChange={onChange} options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).toBe('Please choose an option')
      })

      it('should NOT render default placeholder if there a placeholder prop', () => {
        render(<Select onChange={onChange} placeholder="Choose your favorite fruit" options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).not.toBe('Please choose an option')
      })

      it('should render custom placeholder', () => {
        render(<Select onChange={onChange} placeholder="Choose your favorite fruit" options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).toBe('Choose your favorite fruit')
      })

      it('should NOT render default placeholder if there is a value', () => {
        render(<Select onChange={onChange} options={testOptions} value="apple"/>)
        expect(screen.getByRole('combobox').textContent).not.toBe('Please choose an option')
      })

      it('should NOT render custom placeholder if there is a value', () => {
        render(<Select onChange={onChange} placeholder="Choose your favorite fruit" options={testOptions} value="apple"/>)
        expect(screen.getByRole('combobox').textContent).not.toBe('Choose your favorite fruit')
      })

      it('should render default placeholder if there is an invalid value', () => {
        render(<Select onChange={onChange} value="nofruit" options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).toBe('Please choose an option')
      })

      it('should render custom placeholder if there is an invalid value', () => {
        render(<Select onChange={onChange} placeholder="Choose your favorite fruit" value="nofruit" options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).toBe('Choose your favorite fruit')
      })

      it('should render the value', () => {
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).toBe("Apple")
      })

      it('should NOT render invalid value', () => {
        render(<Select onChange={onChange} value="nofruit" options={testOptions}/>)
        expect(screen.getByRole('combobox').textContent).not.toBe("Nofruit")
      })
    })

    describe('clear button', () => {
      it("should NOT render if there is NO value", () => {
        render(<Select onChange={onChange} options={testOptions} clearable/>)
        expect(screen.queryByRole('button', { name: /clear/i})).toBeNull()
      }); 

      it("should render if there is a value", () => {
        render(<Select onChange={onChange} value="banana" options={testOptions} clearable />)
        expect(screen.getByRole('button', { name: /clear/i})).toBeInTheDocument()
      }); 

      it("should NOT render if select is NOT clearable", () => {
        render(<Select onChange={onChange} value="banana" options={testOptions} />)
        expect(screen.queryByRole('button', { name: /clear/i})).toBeNull()
      }); 

      it("should NOT render when it is clicked", async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions} clearable />)
        const clearButtonElement = screen.getByRole('button', { name: /clear/i})
        await user.click(clearButtonElement)
        const clearButtonElement2 = screen.queryByRole('button', { name: /clear/i})
        expect(clearButtonElement2).toBeNull()
      })
      
      it("should clear selected option when clicked", async() =>{
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions} clearable />)
        const clearButtonElement = screen.getByRole('button', { name: /clear/i})
        await user.click(clearButtonElement)
        expect(screen.getByRole('combobox').textContent).not.toBe("Banana")
      })

      it("should render placeholder when clicked", async() =>{
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions} clearable />)
        const clearButtonElement = screen.getByRole('button', { name: /clear/i})
        await user.click(clearButtonElement)
        expect(screen.getByRole('combobox').textContent).toBe("Please choose an option")
      })
    })

    describe("Select menu", () => {
       it('should NOT render on mount', () => {
         render(<Select onChange={onChange} value="banana" options={testOptions}/>)
         expect(screen.queryByRole('listbox')).toBeNull()
       }) 

       it('should render if we click the select control', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        await user.click(comboBox)
        expect(screen.queryByRole('listbox')).toBeInTheDocument()
      }) 

      it('should NOT render if we click the select control twice', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        await user.click(comboBox)
        expect(screen.queryByRole('listbox')).toBeInTheDocument()
        await user.click(comboBox)
        expect(screen.queryByRole('listbox')).toBeNull()
      }) 

      it('should render options', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        await user.click(comboBox)
        expect(screen.getAllByRole('option')).toHaveLength(3)
      })

      it('should render correct value for option', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        await user.click(comboBox)
        expect(screen.getAllByRole('option')[1].textContent).toBe('Banana')
      })

      it('should set the value when an option is clicked', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        await user.click(comboBox)
        const optionElements = screen.getAllByRole('option')
        await user.click(optionElements[2])
        expect(screen.getByRole('combobox').textContent).toBe("Kiwi")
      })

    });


   describe("Keyboard accessibility - collapsed state", () => {
      it('shows options on SPACE', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Space]')
        expect(screen.queryAllByRole('option').length).toBeGreaterThan(0)
      })

      it('shows options on ENTER', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter]')
        expect(screen.queryAllByRole('option').length).toBeGreaterThan(0)
      })

      it('shows options on ArrowDown', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[ArrowDown]')
        expect(screen.queryAllByRole('option').length).toBeGreaterThan(0)
      }) 

      it('shows options on ArrowUp', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[ArrowUp]')
        expect(screen.queryAllByRole('option').length).toBeGreaterThan(0)
      }) 

      it('shows options and focuses on first option on HOME keydown', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Home]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements.length).toBeGreaterThan(0)
        expect(optionElements[0].classList).toMatch(/current-option/)
      })

      it('shows options and focuses on last option on END keydown', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[End]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements.length).toBeGreaterThan(0)
        expect(optionElements[testOptions.length-1].classList).toMatch(/current-option/)
      })

    describe("Keyboard accessibility - expanded state", () => {

      it('hides options and keeps focus on combobox on ESCAPE', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Escape]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements).toHaveLength(0)
        expect(comboBox).toHaveFocus()
      })  

      it('selects option on ENTER', async() => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][ArrowDown][Enter]')
        expect(comboBox.textContent).toBe("Banana")
      })

      it('selects option on SPACE', async() => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][ArrowDown][Space]')
        expect(comboBox.textContent).toBe("Banana")
      })

      it('selects option on TAB', async() => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][ArrowDown][Tab]')
        expect(comboBox.textContent).toBe("Banana")
      })

      it('keeps focus on combobox on ENTER', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Enter]')
        expect(comboBox).toHaveFocus()
      })

      it('keeps focus on combobox on SPACE', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Space]')
        expect(comboBox).toHaveFocus()
      })

      it('keeps focus on combobox on TAB', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Tab]')
        expect(comboBox).toHaveFocus()
      })

      it('hides options on ENTER', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Enter]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements).toHaveLength(0)
      })

      it('hides options on SPACE', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Space]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements).toHaveLength(0)
      })
      
      it('hides options on TAB', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Tab]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements).toHaveLength(0)
      })
      
      it('moves focus to next option on ArrowDown', async () => {
        //move focus from item 0 to item 1
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="apple" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][ArrowDown]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements[1].classList).toMatch(/current-option/)
      })

      it('moves focus to first option after end of list on ArrowDown', async () => {
         const user = userEvent.setup()
         render(<Select onChange={onChange} value="banana" options={testOptions}/>)
         const comboBox = screen.getByRole('combobox')
         comboBox.focus()
         await user.keyboard('[Enter][ArrowDown][ArrowDown]')
         const optionElements = screen.queryAllByRole('option')
         expect(optionElements[0].classList).toMatch(/current-option/)
      })

      it('moves focus to previous option on ArrowUp', async () => {
        //move focus from item 1 to item 0
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][ArrowUp]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements[0].classList).toMatch(/current-option/)
      })

      it('moves focus to last option after beginning of list on ArrowUp', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][ArrowUp][ArrowUp]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements[testOptions.length-1].classList).toMatch(/current-option/)
     })

      it('moves focus to first option on HOME', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][Home]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements[0].classList).toMatch(/current-option/)
      })

      it('moves focus to first option on END', async () => {
        const user = userEvent.setup()
        render(<Select onChange={onChange} value="banana" options={testOptions}/>)
        const comboBox = screen.getByRole('combobox')
        comboBox.focus()
        await user.keyboard('[Enter][End]')
        const optionElements = screen.queryAllByRole('option')
        expect(optionElements[testOptions.length-1].classList).toMatch(/current-option/)
      })
    })
    
  })
})