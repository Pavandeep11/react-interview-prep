import { vi, expect, describe, it, afterEach } from 'vitest';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { JobsList } from "./JobsList";

afterEach(() => {
	vi.restoreAllMocks();
  });

  
describe('Jobs List', () => {
	
	// Start test
	it("displays jobs after successful API respons", async () => {
		
		 // Mock successful API response
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok : true,
			json: async () => ({
				data : [
					{ id: 1, title: "Senior PHP Developer" },
					{ id: 2, title: "React Developer" }
				]
			})
		});
		
		// Render component
		render(<JobsList />);
		 
		 // Check API results
		expect( 
			await screen.findByText("Senior PHP Developer")
		).toBeInTheDocument();
		
		expect( 
			screen.getByText("React Developer")
		).toBeInTheDocument();
	});
	
	it("displays error when API request fails" , async () => {
		
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok:false
		});
		
		render(<JobsList />);
		
		expect( 
			await screen.findByText("Failed to fetch jobs")
		).toBeInTheDocument();
	}) 
	
});


import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JobsPage from "./JobsPage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("JobsPage", () => {

  it("displays loading message", () => {

    vi.spyOn(globalThis, "fetch").mockReturnValue(
      new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Loading jobs...")
    ).toBeInTheDocument();

  });

});
