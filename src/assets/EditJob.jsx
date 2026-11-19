
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Load companies and existing job
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [companiesResponse, jobResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:8002/api/companies"),
            fetch(`http://127.0.0.1:8002/api/job-postings/${id}`),
          ]);

        if (!companiesResponse.ok) {
          throw new Error("Failed to load companies");
        }

        if (!jobResponse.ok) {
          throw new Error("Failed to load job details");
        }

        const companiesResult = await companiesResponse.json();
        const jobResult = await jobResponse.json();

        const job = jobResult.data;

        setCompanies(companiesResult.data ?? companiesResult);

        setForm({
          title: job.title ?? "",
          company_id: String(job.company_id ?? ""),
          description: job.description ?? "",
          location: job.location ?? "",
          employment_type: job.employment_type ?? "",
          salary_min: job.salary_min ?? "",
          salary_max: job.salary_max ?? "",
          source_url: job.source_url ?? "",
          status: job.status ?? "open",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Update form state
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  // Submit updated job
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      form.salary_min !== "" &&
      form.salary_max !== "" &&
      Number(form.salary_max) < Number(form.salary_min)
    ) {
      setError(
        "Maximum salary must be greater than or equal to minimum salary."
      );
      return;
    }

    const payload = {
      ...form,
      company_id: Number(form.company_id),
      salary_min:
        form.salary_min === "" ? null : Number(form.salary_min),
      salary_max:
        form.salary_max === "" ? null : Number(form.salary_max),
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8002/api/job-postings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : result.message;

        throw new Error(
          validationMessage || "Failed to update job"
        );
      }

      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="create-job-container">
      <h1>Edit Job</h1>

      {error && (
        <div role="alert" className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="company_id">Company</label>
          <select
            id="company_id"
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            required
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="employment_type">Employment Type</label>
          <input
            id="employment_type"
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="salary_min">Minimum Salary</label>
          <input
            id="salary_min"
            name="salary_min"
            type="number"
            step="1"
            min="0"
            value={form.salary_min}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="salary_max">Maximum Salary</label>
          <input
            id="salary_max"
            name="salary_max"
            type="number"
            step="1"
            min="0"
            value={form.salary_max}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="source_url">Job Source URL</label>
          <input
            id="source_url"
            name="source_url"
            type="url"
            value={form.source_url}
            onChange={handleChange}
          />
        </div>

        <div>
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
        </div>

        <button type="submit">
          Update Job
        </button>

        <button
          type="button"
          onClick={() => navigate(`/jobs/${id}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
