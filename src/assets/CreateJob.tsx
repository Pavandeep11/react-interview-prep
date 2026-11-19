
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateJob.css";

export function CreateJob() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company_id: "",
    description: "",
    location: "",
    employment_type: "",
    salary_min: "",
    salary_max: "",
    source_url: "",
    status: "open",
  });

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
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
	if (
		form.salary_min !== "" &&
		form.salary_max !== "" &&
		Number(form.salary_max) < Number(form.salary_min)
	  ) {
		setError("Maximum salary must be greater than or equal to minimum salary.");
		return;
	  }
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        company_id: Number(form.company_id),
        salary_min: form.salary_min === "" ? null : Number(form.salary_min),
        salary_max: form.salary_max === "" ? null : Number(form.salary_max),
      };

      const response = await fetch(
        "http://127.0.0.1:8002/api/job-postings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const validationErrors = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : result.message;

        throw new Error(validationErrors || "Failed to create job");
      }

      navigate("/jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-job-container">
      <h1>Create Job Posting</h1>

      {error && <p role="alert" className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Job Title *</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Senior PHP Developer"
          required
        />

        <label htmlFor="company_id">Company *</label>
        <select
          id="company_id"
          name="company_id"
          value={form.company_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Remote, Canada"
        />

        <label htmlFor="employment_type">Employment Type</label>
        <select
          id="employment_type"
          name="employment_type"
          value={form.employment_type}
          onChange={handleChange}
        >
          <option value="">Select employment type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
        </select>

        <label htmlFor="salary_min">Minimum Salary (CAD)</label>
        <input
          id="salary_min"
          name="salary_min"
          type="number"
          min="0"
          value={form.salary_min}
          onChange={handleChange}
        />

        <label htmlFor="salary_max">Maximum Salary (CAD)</label>
        <input
          id="salary_max"
          name="salary_max"
          type="number"
          min="0"
          value={form.salary_max}
          onChange={handleChange}
        />

        <label htmlFor="description">Job Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          placeholder="Enter job responsibilities and requirements..."
        />

        <label htmlFor="source_url">Job Source URL</label>
        <input
          id="source_url"
          name="source_url"
          type="url"
          value={form.source_url}
          onChange={handleChange}
          placeholder="https://example.com/job"
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Job"}
        </button>

        <button type="button" onClick={() => navigate("/jobs")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
