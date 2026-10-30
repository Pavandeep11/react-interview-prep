
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./EditJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company_id: "",
    description: "",
    location: "",
    employment_type: "",
    salary_min: "",
    salary_max: "",
    status: "",
    source_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function loadJob() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8002/api/job-postings/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not load this job.");
        }

        const result = await response.json();
        const job = result.data ?? result;

        setForm({
          title: job.title ?? "",
          company_id: job.company_id ?? job.company?.id ?? "",
          description: job.description ?? "",
          location: job.location ?? "",
          employment_type: job.employment_type ?? "",
          salary_min: job.salary_min ?? "",
          salary_max: job.salary_max ?? "",
          status: job.status ?? "",
          source_url: job.source_url ?? "",
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load job.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJob();

    return () => controller.abort();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setValidationErrors({});

    try {
      const response = await fetch(
        `http://127.0.0.1:8002/api/job-postings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...form,
            company_id: Number(form.company_id),
            salary_min: form.salary_min === "" ? null : Number(form.salary_min),
            salary_max: form.salary_max === "" ? null : Number(form.salary_max),
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.status === 422) {
        setValidationErrors(result.errors ?? {});
        setError("Please correct the highlighted validation errors.");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to update job.");
      }

      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading job...</p>;
  if (error && !form.title) return <p>{error}</p>;

 
return (
	<main className="edit-job-page">
	  <Link className="edit-job-back" to={`/jobs/${id}`}>
		← Back to job details
	  </Link>
  
	  <section className="edit-job-card">
		<header className="edit-job-header">
		  <h1>Edit Job</h1>
		  <p>Update the job information and save your changes.</p>
		</header>
  
		<form className="edit-job-form" onSubmit={handleSubmit}>
		  {error && (
			<div className="edit-job-error" role="alert">
			  {error}
			</div>
		  )}
  
		  <div className="edit-job-grid">
			<div className="edit-job-field">
			  <label htmlFor="title">Job title *</label>
			  <input
				id="title"
				name="title"
				value={form.title}
				onChange={handleChange}
				required
			  />
			  {validationErrors.title && (
				<small>{validationErrors.title[0]}</small>
			  )}
			</div>
  
			<div className="edit-job-field">
			  <label htmlFor="company_id">Company ID *</label>
			  <input
				id="company_id"
				name="company_id"
				type="number"
				min="1"
				value={form.company_id}
				onChange={handleChange}
				required
			  />
			  {validationErrors.company_id && (
				<small>{validationErrors.company_id[0]}</small>
			  )}
			</div>
  
			<div className="edit-job-field">
			  <label htmlFor="location">Location</label>
			  <input
				id="location"
				name="location"
				value={form.location}
				onChange={handleChange}
				placeholder="e.g. Winnipeg, MB"
			  />
			</div>
  
			<div className="edit-job-field">
			  <label htmlFor="employment_type">Employment type</label>
			  <input
				id="employment_type"
				name="employment_type"
				value={form.employment_type}
				onChange={handleChange}
				placeholder="e.g. Full-time"
			  />
			</div>
  
			<div className="edit-job-field">
			  <label htmlFor="salary_min">Minimum salary (CAD)</label>
			  <input
				id="salary_min"
				name="salary_min"
				type="number"
				min="0"
				value={form.salary_min}
				onChange={handleChange}
				placeholder="e.g. 60000"
			  />
			  {validationErrors.salary_min && (
				<small>{validationErrors.salary_min[0]}</small>
			  )}
			</div>
  
			<div className="edit-job-field">
			  <label htmlFor="salary_max">Maximum salary (CAD)</label>
			  <input
				id="salary_max"
				name="salary_max"
				type="number"
				min="0"
				value={form.salary_max}
				onChange={handleChange}
				placeholder="e.g. 85000"
			  />
			  {validationErrors.salary_max && (
				<small>{validationErrors.salary_max[0]}</small>
			  )}
			</div>
  
			
			<div className="edit-job-field">
			<label htmlFor="status">Job status *</label>
			<select
				id="status"
				name="status"
				value={form.status}
				onChange={handleChange}
				required
			>
				<option value="">Choose status</option>
				<option value="open">Open</option>
				<option value="closed">Closed</option>
				<option value="draft">Draft</option>
			</select>

			{validationErrors.status && (
				<small>{validationErrors.status[0]}</small>
			)}
			</div>

  
			<div className="edit-job-field">
			  <label htmlFor="source_url">Original posting URL</label>
			  <input
				id="source_url"
				name="source_url"
				type="url"
				value={form.source_url}
				onChange={handleChange}
				placeholder="https://..."
			  />
			  {validationErrors.source_url && (
				<small>{validationErrors.source_url[0]}</small>
			  )}
			</div>
  
			<div className="edit-job-field full-width">
			  <label htmlFor="description">Job description</label>
			  <textarea
				id="description"
				name="description"
				value={form.description}
				onChange={handleChange}
				rows={6}
				placeholder="Enter the job description..."
			  />
			  {validationErrors.description && (
				<small>{validationErrors.description[0]}</small>
			  )}
			</div>
		  </div>
  
		  <div className="edit-job-actions">
			<Link
			  className="edit-job-button secondary"
			  to={`/jobs/${id}`}
			>
			  Cancel
			</Link>
  
			<button
			  className="edit-job-button primary"
			  type="submit"
			  disabled={saving}
			>
			  {saving ? "Saving changes..." : "Save Changes"}
			</button>
		  </div>
		</form>
	  </section>
	</main>
  );
};
  
export default EditJob;
