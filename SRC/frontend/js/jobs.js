document.addEventListener('DOMContentLoaded', () => {
  const jobsTableBody = document.querySelector('#jobs-table-body');
  const addJobForm = document.getElementById('add-job-form');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');

  let currentPage = 1;
  const rowsPerPage = 25;

  const fetchJobs = () => {
    const offset = (currentPage - 1) * rowsPerPage;
    fetch(`http://localhost:3000/api/jobs?limit=${rowsPerPage}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        populateJobsTable(data);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  };

  const populateJobsTable = (jobs) => {
    jobsTableBody.innerHTML = '';
    jobs.forEach(job => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${job.Job_ID}</td>
        <td>${job.ClientName}</td>
        <td>${job.Number_Of_Trucks}</td>
        <td>${job.Start_Date}</td>
        <td>${job.End_Date || 'N/A'}</td>
        <td>${job.job_status ? 'Completed' : 'In Progress'}</td>
        <td>
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
        </td>
      `;
      jobsTableBody.appendChild(row);
    });
  };

  addJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addJobForm);
    const job = Object.fromEntries(formData.entries());

    fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    })
      .then(response => response.json())
      .then(() => fetchJobs())
      .catch(error => console.error('Error adding job:', error));
  });

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    fetchJobs();
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchJobs();
  });

  fetchJobs();
});
