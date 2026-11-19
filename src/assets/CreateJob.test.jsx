
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CreateJob } from "./CreateJob";

describe("CreateJob", () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Render the form
  it("renders the job creation form", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, name: "Acme Inc." }],
      }),
    });

    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /create job posting/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/job title/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("option", {
        name: "Acme Inc.",
      })
    ).toBeInTheDocument();
  });

  // Test 2: Load companies
  it("loads companies into the dropdown", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, name: "Acme Inc." }],
      }),
    });

    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("option", {
        name: "Acme Inc.",
      })
    ).toBeInTheDocument();
  });

  // Test 3: Submit a new job
  it("submits a new job to the Laravel API", async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: 1, name: "Acme Inc." }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: 10,
            title: "Senior Laravel Developer",
          },
        }),
      });

    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/job title/i),
      "Senior Laravel Developer"
    );

    await user.selectOptions(
      screen.getByLabelText(/company/i),
      "1"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save job/i,
      })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    const saveRequest = global.fetch.mock.calls[1];

    expect(saveRequest[0]).toBe(
      "http://127.0.0.1:8002/api/job-postings"
    );

    expect(saveRequest[1].method).toBe("POST");

    expect(JSON.parse(saveRequest[1].body)).toMatchObject({
      title: "Senior Laravel Developer",
      company_id: 1,
    });
  });
  
  // Test 4: Laravel Validation
  it("displays Laravel validation errors", async () => {
	const user = userEvent.setup();
  
	global.fetch = vi.fn()
	  .mockResolvedValueOnce({
		ok: true,
		json: async () => ({
		  data: [{ id: 1, name: "Acme Inc." }],
		}),
	  })
	  .mockResolvedValueOnce({
		ok: false,
		json: async () => ({
		  message: "Validation failed",
		  errors: {
			title: ["The title field is required."],
		  },
		}),
	  });
  
	render(
	  <MemoryRouter>
		<CreateJob />
	  </MemoryRouter>
	);
  
	await user.type(
	  screen.getByLabelText(/job title/i),
	  "Developer"
	);
  
	await user.selectOptions(
	  screen.getByLabelText(/company/i),
	  "1"
	);
  
	await user.click(
	  screen.getByRole("button", { name: /save job/i })
	);
  
	expect(await screen.findByRole("alert"))
	  .toHaveTextContent("The title field is required.");
  });
});
