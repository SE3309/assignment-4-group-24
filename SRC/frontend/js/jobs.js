// Fetch and display jobs
async function fetchJobs() {
    try {
      const response = await fetch('http://localhost:3000/jobs');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const jobs = await response.json();
      const tableBody = document.getElementById('job-table-body');
      tableBody.innerHTML = '';
  
      jobs.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${job.Job_ID}</td>
          <td>${job.Start_Date}</td>
          <td>${job.Number_Of_Trucks}</td>
          <td>${job.Job_Type}</td>
          <td>${job.Client_ID}</td>
          <td>${job.Dispatcher_ID}</td>
          <td>${job.job_status ? 'Completed' : 'Pending'}</td>
          <td>
            <button onclick="editJob(${job.Job_ID})">Edit</button>
            <button onclick="deleteJob(${job.Job_ID})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }
  
  // Add a job
  document.getElementById('add-job-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    const response = await fetch('http://localhost:3000/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      alert('Job added successfully!');
      fetchJobs();
    } else {
      alert('Error adding job.');
    }
  });
  
  // Edit a job
  async function editJob(id) {
    const newType = prompt('Enter new job type (leave blank to keep unchanged):');
    if (newType) {
      const response = await fetch(`http://localhost:3000/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Job_Type: newType }),
      });
  
      if (response.ok) {
        alert('Job updated.');
        fetchJobs();
      } else {
        alert('Error updating job.');
      }
    }
  }
  
  // Delete a job
  async function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
      const response = await fetch(`http://localhost:3000/jobs/${id}`, { method: 'DELETE' });
  
      if (response.ok) {
        alert('Job deleted.');
        fetchJobs();
      } else {
        alert('Error deleting job.');
      }
    }
  }
  
  // Fetch jobs on page load
  window.onload = fetchJobs;
  