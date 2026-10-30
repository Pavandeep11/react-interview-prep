import{ useState, useEffect } from 'react';
import useDebounce from "./hooks/useDebounce";
import { Link } from "react-router-dom";
import StatusBadge from "./components/StatusBadge";


function formatSalary(min, max) {
	const formatAmount = (amount) =>
		new Intl.NumberFormat("en-CA", {
		style: "currency",
		currency: "CAD",
		maximumFractionDigits: 0,
		}).format(amount);

	if (min == null && max == null) return "Salary not specified";
	if (min == null) return `Up to ${formatAmount(max)}`;
	if (max == null) return `From ${formatAmount(min)}`;

	return `${formatAmount(min)} – ${formatAmount(max)}`;
}
  
function JobsPage() {
	
	const[ jobs, setJobs] = useState([]);
	const[ loading, setLoading ] = useState(true);
	const[ error, setError] = useState("");
	const[ status, setStatus] = useState("all");
	const[ search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 400);
	const[currentPage, setCurrentPage] = useState(1);
	const[lastPage, setLastPage] = useState(1);
	const[isRefreshing, setIsRefreshing] = useState(false);
 	
	useEffect(() => {
		const controller = new AbortController();
	
		async function fetchJobs() {
			const startTime = Date.now();
			setIsRefreshing(true);
			setError("");
			if (jobs.length === 0) {
				setLoading(true);
			}
			
			try {
				const params = new URLSearchParams({
				page: currentPage,
				});
		
				if (debouncedSearch.trim()) {
				params.set("search", debouncedSearch.trim());
				}
		
				if (status !== "all") {
				params.set("status", status);
				}
		
				const response = await fetch(
				`http://127.0.0.1:8002/api/job-postings?${params.toString()}`,
				{
					signal: controller.signal,
				}
				);
		
				if (!response.ok) {
				throw new Error("Failed to fetch jobs");
				}
		
				const result = await response.json();
		
				if (controller.signal.aborted) return;
		
				setJobs(result.data);
				setLastPage(result.meta.last_page);
			} catch (err) {
				if (err.name !== "AbortError") {
				setError(err.message);
				}
			} finally {
				if (!controller.signal.aborted) {
					const elapsed = Date.now() - startTime;
					const remaining = Math.max(0, 500 - elapsed);
				
					setTimeout(() => {
					  if (!controller.signal.aborted) {
						setLoading(false);
						setIsRefreshing(false);
					  }
					}, remaining);
				  }
			}
		}
	
		fetchJobs();
	
		return () => {
		controller.abort();
		};
	}, [currentPage, debouncedSearch, status]);
  
	
	if (loading && jobs.length === 0) {
		return <p>Loading jobs...</p>;
	}
	
	if(error){
		return <p>Error : {error}</p>;
	}
	
	return(
		<div>
			<h1>Job tracking</h1>
			<input
			    type="text"
				placeholder="Search title or company..."
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setCurrentPage(1);
				}}/>
			<select value={status}
				onChange={e => {
					setStatus(e.target.value);
					setCurrentPage(1);
				}}>
					<option value="all">All Jobs</option>
					<option value="open">Open</option>
					<option value="closed">Closed</option>
				</select>
			
				{!isRefreshing && jobs.length === 0 ? (
				<div>
					<h3>No jobs found</h3>

					{debouncedSearch.trim() ? (
					<p>
						No jobs match "{debouncedSearch}".
					</p>
					) : status !== "all" ? (
					<p>
						No {status} jobs found.
					</p>
					) : (
					<p>No jobs are available right now.</p>
					)}

					{(search || status !== "all") && (
					<button
						onClick={() => {
						setSearch("");
						setStatus("all");
						setCurrentPage(1);
						}}
					>
						Clear filters
					</button>
					)}
				</div>
				) : (
				jobs.map((job) => (
					<div key={job.id}>
					<h3>
					<Link to={`/jobs/${job.id}`}>{job.title}</Link>
					</h3>

					<StatusBadge status={job.status} />

					<Link to={`/jobs/${job.id}`}>
					View Details →
					</Link>
					<p>Company: {job.company?.name}</p>
					<p>Location: {job.location}</p>
					<p>
					<p>{formatSalary(job.salary_min, job.salary_max)}</p>
					</p>
					<p>Status: {job.status}</p>
					<hr />
					</div>
				))
				)}

			
			<div>
				<button disabled={currentPage ==1}
					onClick={() => setCurrentPage(page => page -1)} >
					Previous
				</button>
				<span>
					Page {currentPage} of {lastPage} 
				</span>
				<button 
					disabled={currentPage === lastPage}
					onClick={() => setCurrentPage(page => page +1 )}>
					Next
				</button>
			</div>
		
		</div>
		
	);
}

export default JobsPage;