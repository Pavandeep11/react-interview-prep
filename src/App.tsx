import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { JobList } from './assets/JobList'
import { CreateJob } from './assets/CreateJob'
import JobsPage from "./JobsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Render your JobsPage component when the user goes to the homepage */}
        <Route path="/" element={<JobsPage />} />
        
        {/* Your other pages */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/create" element={<CreateJob />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
