import React from "react";
import { useNavigate } from 'react-router-dom';

export function CreateJob () {
	const navigate = useNavigate();
	const handleSubmit = () => {
		console.log("Job saved successfully");
		navigate('/jobs');
	}
	return (<button onClick={handleSubmit}> Save</button>);
}