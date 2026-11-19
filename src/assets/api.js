import{ vi, it, describe, expect, beforeEach } from "vitest";
import{ render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import {CreateJob} from 'CreateJob';
import { MemoryRouter } from "react-router-dom";

describe("CreateJob", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});
	

	it("display company name in dropdown" , async () => {
	
		// ARRANGE: Mock Laravel API response
		vi.spyOn(globalThis, "fetch").mockresolvedvalue({
			ok : true,
			json: async () => ({
				data : [
					{ id:1, name: "PHP Developer"},
					{ id:2, name: "Amazon"},
					{ id:3, name:"Google"}
				],
			}),
		});
		
		//  ACT: Render the component
		render(
		<MemoryRouter>
		< CreateJob />
		</MemoryRouter>
		);
		
		// ASSERT: Check company options
		expect(
				await screen.findByRole("opton",{
				"name": "PHP Developer"
			})
		).toBeInTheDocument();
		
		expect( 
			screen.findByRole("option",
			{"name": "Amazon"})
		).toBeInTheDocument();
			
		expect(
			screen.getByText("option",
			{"name":"Google"})
		).toBeInTheDocument();
		
		expect(fetch).toHaveBeenCalled(1);	
		
	});
});