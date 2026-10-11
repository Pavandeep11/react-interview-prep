import{ useState, useEffect } from 'react';

function JobsPage() {
	
	const[ jobs, setjobs] = useState([]);
	const[ loading, setLoading ] = useState(true);
	const[ error, setError] = useState("");
	const[ status, setStatus] = useState("all");
	const[ search, setSearch] = useState("");
	
	useEffect( () => {
		
		async function fetchJobs () {
			
			try{
				const response = await fetch(
					"http://127.0.0.1:8002/api/job-postings"
					);
				if(!response.ok) {
					throw new Error("Falied to fetch jobs");
				}
				const result = await response.json();
				
				setjobs(result.data);
				console.log("My jobs data is:", jobs);
			}catch(err){
				setError(err.message);
			}finally{
				setLoading(false);
			}
		}
		fetchJobs();
	},[]);
	
	if(loading) {
		return <p>Loading jobs...</p>;
	}
	
	if(error){
		return <p>Error : {error}</p>;
	}
	
	const filteredJobs = jobs.filter((job) => {
		const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
		job.company?.name.toLowerCase().includes(search.toLowerCase());
		
		const matchesStatus = status == "all" || job.status === status;
	
		return matchSearch && matchesStatus;
	});
	

	
	return(
		<div>
			<h1>Job tracking</h1>
			<input
			    type="text"
				placeholder="Search title or company..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}/>
			<select value={status}
				onChange={e => setStatus(e.target.value)}>
					<option value="all">All Jobs</option>
					<option value="open">Open</option>
					<option value="closed">Closed</option>
				</select>
				{filteredJobs?.length === 0 ? (<p>No Jobs Found.</p>) : (filteredJobs?.map((job) => (
					<div key ={job.id}>
						<h2>Title: {job.title}</h2>
						<p>Company: {job.company?.name}</p>
						<p>Location: {job.location}</p>
						<p>Salary: ${ job.salary_min?.toLocaleString()} - $
						{job.salary_max?.toLocaleString()}</p>
						<p>Status: {job.status}</p>
						<hr/>
					</div>
					))
				)}
		</div>
	);
}

export default JobsPage;