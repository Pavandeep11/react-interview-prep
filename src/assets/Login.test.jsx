
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";


/* 
	Use getByRole("textbox") or getByPlaceholderText()
	await user.type(element, "text")
	await user.click(button)
*/
describe("Login", () => {
  it("allows user to enter an email", async () => {

    // Create user interaction instance
    const user = userEvent.setup();

    // Render component
    render(<Login />);

    // Find input
    const emailInput = screen.getByPlaceholderText(
      "Enter email"
    );

    // Type email
    await user.type(emailInput, "pavan@gmail.com");

    // Verify email appears
    expect(emailInput).toHaveValue("pavan@gmail.com");

  });
  
  it("does not display email when input is empty", () => {
	render(<Login />);
  
	expect(
	  screen.queryByText("Email:")
	).not.toBeInTheDocument();
  });
  
  //Clear an Input
  
  it("allows user to clear the email input", async () => {
	
	 // Create user interaction instance
	 const user = userEvent.setup();
	 // 1. initilise the event
	 // 2. render the login form
	 // 3. check input filed by placeholder
	 // 4. enter email - await while typing
	 // 5. Check after enter so expect value
	 // 6. clear the the input
	 // 7. Check wether clear or not
	 
	// Render component
	render(<Login />);
	
	const emailInput = screen.getByPlaceholderText("Enter email");
	
	await user.type(emailInput, "pavan@gmail.com");
	
	expect(emailInput).toHaveValue("pavan@gmail.com");
	
	await user.clear(emailInput);
	
	expect(
		emailInput
	).toHaveValue("");
	
  });
  
  it("shows validation error when email is empty", async ()  => {
	
		const user = userEvent.setup();
		
		// Step 1: Render component
		render(<Login />);
		
		// Step 2: Find Submit button
		const button =  screen.getByRole("button" , {
			name : "Submit",
		});
		
		// Step 3: Click Submit
		await user.click(button)
	
		// Step 4: Verify error message
		expect(
			screen.getByText("Email is required")
		).toBeInTheDocument();
  });
  
  
it("shows success message after submit", async () => {

	const user = userEvent.setup();
  
	// Arrange
	render(<Login />);
  
	const emailInput = screen.getByPlaceholderText(
	  "Enter email"
	);
  
	// Act
	await user.type(emailInput, "pavan@gmail.com");
  
	await user.click(screen.getByRole("button", { name: "Submit" }));  
	// Assert
	expect(
	  screen.getByText("Login successful")
	).toBeInTheDocument();
  
  });
  
});
