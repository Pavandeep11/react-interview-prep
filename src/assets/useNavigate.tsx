import React from 'react';
import { useNavigate } from "react-router-dom";

export function CreateJob () {
	const navigate = useNavigate();

	const handleSubmit = () => {
		navigate("/jobs");
	}
	return <button onClick={handleSubmit}>List</button>
}