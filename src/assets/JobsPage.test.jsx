import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import JobsPage from "./JobsPage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("JobsPage", () => {
  it("shows loading while jobs are being fetched", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(
      new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading jobs...")).toBeInTheDocument();
  });

  it("displays jobs after a successful API response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 1,
            title: "Senior PHP Developer",
            status: "open",
            company: { name: "Google" },
            location: "Winnipeg",
            salary_min: 90000,
            salary_max: 110000,
          },
        ],
        meta: { last_page: 1 },
      }),
    });

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Senior PHP Developer")
    ).toBeInTheDocument();

    expect(screen.getByText("Company: Google")).toBeInTheDocument();
  });

  it("displays an error when the API request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    });

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Error : Failed to fetch jobs")
    ).toBeInTheDocument();
  });
  
  
  it("searches jobs by title", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 1,
            title: "Laravel Developer",
            status: "open",
            company: { name: "Google" },
            location: "Winnipeg",
            salary_min: 80000,
            salary_max: 100000,
          },
        ],
        meta: { last_page: 1 },
      }),
    });

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    await screen.findByText("Laravel Developer");

    const searchInput = screen.getByPlaceholderText(
      "Search title or company..."
    );

    await user.type(searchInput, "Laravel");

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    }, { timeout: 3000 });

    expect(globalThis.fetch.mock.calls[1][0]).toContain(
      "search=Laravel"
    );
  });

  it("filters jobs by status", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
        meta: { last_page: 1 },
      }),
    });

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    await screen.findByText("No jobs found");

    const statusSelect = screen.getByRole("combobox");

    await user.selectOptions(statusSelect, "open");

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    }, { timeout: 3000 });

    expect(globalThis.fetch.mock.calls[1][0]).toContain(
      "status=open"
    );
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
        meta: { last_page: 2 },
      }),
    });

    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );

    await screen.findByText("No jobs found");

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", {
      name: "Next",
    }));

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    expect(globalThis.fetch.mock.calls[1][0]).toContain("page=2");
  });
});