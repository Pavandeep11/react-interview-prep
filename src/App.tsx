import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { JobList } from './assets/JobList'
import { CreateJob } from './assets/CreateJob'
import JobsPage from "./JobsPage"
import JobDetails from "./JobDetails"
import EditJob from "./EditJob";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Render your JobsPage component when the user goes to the homepage */}
        <Route path="/" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/edit" element={<EditJob />} />
        {/* Your other pages */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/create" element={<CreateJob />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
