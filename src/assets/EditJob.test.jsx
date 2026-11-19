
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EditJob } from "./EditJob";

describe("EditJob", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads existing job data into the form", async () => {
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
            title: "Senior Developer",
            company_id: 1,
            description: "Laravel development",
            location: "Winnipeg",
            employment_type: "Full-time",
            salary_min: 80000,
            salary_max: 100000,
            source_url: "https://example.com/job",
            status: "open",
          },
        }),
      });

    render(
      <MemoryRouter initialEntries={["/jobs/10/edit"]}>
        <Routes>
          <Route path="/jobs/:id/edit" element={<EditJob />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByDisplayValue("Senior Developer")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Winnipeg")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("80000")
    ).toBeInTheDocument();
  });
});
