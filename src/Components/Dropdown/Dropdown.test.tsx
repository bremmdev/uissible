import { describe, it, expect, vi } from "vitest";
import { screen, render, userEvent } from "../../../test-utils";
import Dropdown from "./Dropdown";
import React from "react"

describe("Dropdown", () => {

  it('should NOT focus on render when it does not have autoFocus prop', () => {
    render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
    expect(screen.getByRole("button", { name: /please choose an option/i})).not.toHaveFocus()
  })

  it('should focus on render when it has autoFocus prop', () => {
    render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} autoFocus/>);
    expect(screen.getByRole("button", { name: /please choose an option/i})).toHaveFocus()
  })

  describe("Dropdown button", () => {
    it("should render button", () => {
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      expect(screen.getByRole("button", { name: /please choose an option/i})).toBeInTheDocument();
    });

    it("should render placeholder if there is no option selected", () => {
      render(<Dropdown onChange={vi.fn()} placeholder="Please choose your favorite fruit" options={["apple", "banana", "kiwi"]} value=""/>);
      expect(screen.getByRole("button", { name: /please choose your favorite fruit/i })).toBeInTheDocument();
    });

    it("should render default placeholder if there is no placeholder prop and no option selected", () => {
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} value=""/>);
      expect(screen.getByRole("button", { name: /please choose an option/i })).toBeInTheDocument();
    })

    it("should NOT render placeholder if there is an option selected", () => {
      render(<Dropdown onChange={vi.fn()} placeholder="Please choose your favorite fruit" options={["apple", "banana", "kiwi"]} value="apple" />);
      expect(screen.queryByRole("button", { name: /please choose your favorite fruit/i })).toBeNull()
    });

    it("should NOT render default placeholder if there is an option selected", () => {
      render(<Dropdown onChange={vi.fn()} placeholder="" options={["apple", "banana", "kiwi"]} value="apple"/>);
      expect(screen.queryByRole("button", { name: /please choose an option/i })).toBeNull()
    });

    it("should render value if there is an option selected", () => {
      render(<Dropdown onChange={vi.fn()} placeholder="Please choose your favorite fruit" options={["apple", "banana", "kiwi"]} value="apple"/>);
      const buttonElement = screen.getByRole("button", { name: /apple/i })
      expect(buttonElement).toBeInTheDocument();
    })

    it('should NOT render an invalid option', () => {
      render(<Dropdown onChange={vi.fn()} placeholder="Please choose your favorite fruit" options={["apple", "banana", "kiwi"]} value="melon"/>);
      const buttonElement = screen.queryByRole("button", { name: /melon/i })
      expect(buttonElement).toBeNull()
    })

    it('should render placeholder if there is an invalid value', () => {
      render(<Dropdown onChange={vi.fn()} placeholder="Please choose your favorite fruit" options={["apple", "banana", "kiwi"]} value="melon"/>);
      const buttonElement = screen.getByRole("button", { name: /please choose your favorite fruit/i })
      expect(buttonElement).toBeInTheDocument()
    })

    describe("Clear input button", () => {
      it("should NOT render if dropdown is NOT clearable", () => {
        render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} value="kiwi"/>);
        expect(screen.queryByRole('button', { name: /clear input/i})).toBeNull()
      })
  
      it("should NOT render if there is no value", () => {
        render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} clearable/>);
        expect(screen.queryByRole('button', { name: /clear input/i})).toBeNull()
      })
  
      it("should NOT render if there is an invalid value", () => {
        render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} value="melon" clearable/>);
        expect(screen.queryByRole('button', { name: /clear input/i})).toBeNull()
      })
  
      it("should render if there is a valid value", () => {
        render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} value="kiwi" clearable/>);
        expect(screen.queryByRole('button', { name: /clear input/i})).toBeInTheDocument()
      })
  
      it('should show placeholder if we click the clear button', async () => {
        const user = userEvent.setup()
        render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} clearable value="kiwi"/>);
        expect(screen.queryByRole('button', { name: /kiwi/i })).toBeInTheDocument()
        const buttonElement = screen.queryByRole('button', { name: /clear input/i})
        if(buttonElement){
          await user.click(buttonElement)
        }
        expect(screen.queryByRole('button', { name: /kiwi/i })).toBeNull()
      })
  
      it('should NOT render if we click the clear button', async () => {
        const user = userEvent.setup()
        render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]} clearable value="kiwi"/>);
        expect(screen.queryByRole('button', { name: /clear input/i})).toBeInTheDocument()
        const buttonElement = screen.queryByRole('button', { name: /clear input/i})
        if(buttonElement){
          await user.click(buttonElement)
        }
        expect(screen.queryByRole('button', { name: /clear input/i})).toBeNull()
      })
    }) 
  });

  describe("Dropdown list", () => {
    it("should render list", () => {
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it('should NOT render list-items if there are no options', () => {
      render(<Dropdown onChange={vi.fn()} options={[]}/>);
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should render a list item for every option', async () => {
      const user = userEvent.setup()
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      expect(screen.queryAllByRole('option')).toHaveLength(3)
    })

    it('should render correct option value for every option', async () => {
      const user = userEvent.setup()
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      const listItemElements = screen.queryAllByRole('option')
      expect(listItemElements[1].textContent).toBe("Banana")
    })

    it('should NOT render list items if button is NOT clicked', () => {
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should render list items if button is clicked', async () => {
      const user = userEvent.setup()
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      expect(screen.queryAllByRole('option')).toHaveLength(3)
    })

    it('should hide the list items if the button is clicked twice', async () => {
      const user = userEvent.setup()
      render(<Dropdown onChange={vi.fn()} options={["apple", "banana", "kiwi"]}/>);
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      expect(screen.queryAllByRole('option')).toHaveLength(3)
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should set the correct selected option', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} onChange={onChange}/>);
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      const listItemElements = screen.getAllByRole('option')
      await user.click(listItemElements[2])
      expect(screen.getByRole('button', { name: /kiwi/i})).toBeInTheDocument()
    })

    it('should call onChange when we selected an option', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} onChange={onChange}/>);
      await user.click(screen.getByRole('button', { name: /please choose an option/i}))
      const listItemElements = screen.getAllByRole('option')
      await user.click(listItemElements[2])
      expect(onChange).toHaveBeenCalledOnce()
    })
  })

  describe("keyboard accessibility", () => {
    it('should render the options on ArrowDown', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })

    it('should render the options on ArrowUp', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowUp]')
      expect(screen.getAllByRole('option')).toHaveLength(3)
    })

    it('should focus first option on ArrowDown', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      const optionElements = screen.getAllByRole('option')
      expect(optionElements[0]).toHaveFocus()
    })

    it('should select first option on ArrowDown', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      expect(screen.getByRole('button', { name: /apple/i})).toBeInTheDocument()
    })

    it('should cycle through options with arrowDown', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown][ArrowDown]')
      expect(screen.getByRole('button', { name: /banana/i})).toBeInTheDocument()
      await user.keyboard('[ArrowDown][ArrowDown]')
      expect(screen.getByRole('button', { name: /apple/i})).toBeInTheDocument()
    })

    it('should focus last option on ArrowUp', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowUp]')
      const optionElements = screen.getAllByRole('option')
      expect(optionElements[optionElements.length-1]).toHaveFocus()
    })

    it('should select last option on ArrowUp', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowUp]')
      expect(screen.getByRole('button', { name: /kiwi/i})).toBeInTheDocument()
    })

    it('should cycle through options with arrowUp', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowUp][ArrowUp]')
      expect(screen.getByRole('button', { name: /banana/i})).toBeInTheDocument()
      await user.keyboard('[ArrowUp][ArrowUp]')
      expect(screen.getByRole('button', { name: /kiwi/i})).toBeInTheDocument()
    })

    it('should not render the options on pressing ESC', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      expect(screen.queryAllByRole('option')).toHaveLength(3)
      await user.keyboard('[Escape]')
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should not render the options on pressing SPACE', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      expect(screen.queryAllByRole('option')).toHaveLength(3)
      await user.keyboard('[Space]')
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should not render the options on pressing ENTER', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      expect(screen.queryAllByRole('option')).toHaveLength(3)
      await user.keyboard('[Enter]')
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    it('should not render the options on pressing TAB', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Dropdown options={["apple", "banana", "kiwi"]} autoFocus onChange={onChange}/>) 
      await user.keyboard('[ArrowDown]')
      expect(screen.queryAllByRole('option')).toHaveLength(3)
      await user.keyboard('[Tab]')
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })  
  })
});
