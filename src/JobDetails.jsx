
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";

function formatSalary(amount) {
  if (amount == null || amount === "") return null;

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  
  useEffect(() => {
    const controller = new AbortController();

    async function fetchJob() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8002/api/job-postings/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Job not found."
              : "Unable to load job details."
          );
        }

        const result = await response.json();
        setJob(result.data ?? result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchJob();

    return () => controller.abort();
  }, [id]);

  if (loading) return <p className="page-message">Loading job details...</p>;
  if (error) return <p className="page-message error">{error}</p>;
  if (!job) return <p className="page-message">Job not found.</p>;

  const salaryMin = formatSalary(job.salary_min);
  const salaryMax = formatSalary(job.salary_max);

  async function handleDelete() {
	const confirmed = window.confirm(
	  "Are you sure you want to delete this job? This action cannot be undone."
	);
  
	if (!confirmed) return;
  
	setDeleting(true);
	setDeleteError("");
  
	try {
	  const response = await fetch(
		`http://127.0.0.1:8002/api/job-postings/${id}`,
		{
		  method: "DELETE",
		  headers: {
			Accept: "application/json",
		  },
		}
	  );
  
	  if (!response.ok) {
		throw new Error("Failed to delete job. Please try again.");
	  }
  
	  navigate("/");
	} catch (err) {
	  setDeleteError(err.message || "Something went wrong.");
	} finally {
	  setDeleting(false);
	}
  }
  
  return (
    <main className="job-details-page">
      <Link className="back-link" to="/">
        ← Back to jobs
      </Link>
	  <Link className="edit-job-button" to={`/jobs/${job.id}/edit`}>
		Edit Job
		</Link>
		<button
			type="button"
			className="delete-job-button"
			onClick={handleDelete}
			disabled={deleting}
			>
			{deleting ? "Deleting..." : "Delete Job"}
		</button>
		{deleteError && (
		<p role="alert" className="delete-job-error">
			{deleteError}
		</p>
		)}
      <article className="job-details-card">
        <header className="job-details-header">
          <div>
            <p className="company-name">
              {job.company?.name ?? "Company not provided"}
            </p>
            <h1>{job.title}</h1>
            <p className="job-location">
              {job.location || "Location not specified"}
            </p>
          </div>

          <span className={`status-badge status-${job.status || "unknown"}`}>
            {job.status || "Unknown"}
          </span>
        </header>

        <div className="job-facts">
          <div>
            <span className="fact-label">Employment type</span>
            <strong>{job.employment_type || "Not specified"}</strong>
          </div>

          <div>
            <span className="fact-label">Salary range</span>
            <strong>
              {salaryMin || salaryMax
                ? `${salaryMin || "Not specified"} – ${salaryMax || "Not specified"}`
                : "Not specified"}
            </strong>
          </div>
        </div>

        <section className="job-description">
          <h2>Job description</h2>
          <p>{job.description || "No description available."}</p>
        </section>

        {job.source_url && (
          <a
            className="source-link"
            href={job.source_url}
            target="_blank"
            rel="noreferrer"
          >
            View original posting ↗
          </a>
        )}
      </article>
    </main>
  );
}

export default JobDetails;
