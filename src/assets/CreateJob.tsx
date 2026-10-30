import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateJob() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8002/api/companies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load companies");
        }
        return response.json();
      })
      .then((result) => {
        setCompanies(result.data ?? result);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Next, we will connect this form to Laravel.");
  };

  return (
    <div>
      <h1>Create Job Posting</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Job Title</label>
        <input id="title" name="title" required />

        <br />

        <label htmlFor="company_id">Company</label>
        <select id="company_id" name="company_id" required defaultValue="">
          <option value="" disabled>
            Select a company
          </option>

          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <br />

        <button type="submit">Save Job</button>
        <button type="button" onClick={() => navigate("/jobs")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
