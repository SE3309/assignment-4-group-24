document.addEventListener('DOMContentLoaded', () => {
  const jobsTableBody = document.querySelector('#jobs-table-body');
  const addJobForm = document.getElementById('add-job-form');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const searchBar = document.getElementById('search-bar');
  const resetFiltersButton = document.getElementById('reset-filters');

  const sortButtons = {
    startDate: document.getElementById('sort-start-date'),
    endDate: document.getElementById('sort-end-date'),
    client: document.getElementById('sort-client'),
  };

  let currentPage = 1;
  const rowsPerPage = 25;
  let primarySortKey = 'Start_Date'; // Default primary sorting column
  let sortOrder = 'ASC'; // Default sort order
  let searchTerm = ''; // For search/filter

  // Fetch jobs from API
  const fetchJobs = () => {
    const offset = (currentPage - 1) * rowsPerPage;

    const query = `limit=${rowsPerPage}&offset=${offset}&primarySortKey=${primarySortKey}&sortOrder=${sortOrder}&search=${encodeURIComponent(
      searchTerm
    )}`;
    fetch(`http://localhost:3000/api/jobs?${query}`)
      .then((response) => response.json())
      .then((data) => {
        populateJobsTable(data);
        updatePaginationButtons(data.length);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        jobsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Failed to load jobs</td></tr>';
      });
  };

  // Populate the table with fetched jobs
  const populateJobsTable = (jobs) => {
    jobsTableBody.innerHTML = ''; // Clear existing rows
    jobs.forEach((job) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${job.Job_ID}</td>
        <td>${job.ClientName}</td>
        <td>${job.Number_Of_Trucks}</td>
        <td>${job.Start_Date}</td>
        <td>${job.End_Date || 'N/A'}</td>
        <td>${job.job_status ? 'Completed' : 'In Progress'}</td>
        <td>
          <button class="edit-button" data-id="${job.Job_ID}">Edit</button>
          <button class="delete-button" data-id="${job.Job_ID}">Delete</button>
        </td>
      `;
      jobsTableBody.appendChild(row);
    });

    attachEditListeners();
    attachDeleteListeners();
  };

  // Update pagination buttons
  const updatePaginationButtons = (rowCount) => {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = rowCount < rowsPerPage;
  };

  // Reset filters and sorting
  resetFiltersButton.addEventListener('click', () => {
    currentPage = 1;
    primarySortKey = 'Start_Date';
    sortOrder = 'ASC';
    searchTerm = '';
    searchBar.value = '';
    fetchJobs();
  });

  // Sort buttons
  Object.entries(sortButtons).forEach(([key, button]) => {
    button.addEventListener('click', () => {
      if (primarySortKey === key) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        primarySortKey = key;
        sortOrder = 'ASC';
      }
      fetchJobs();
    });
  });

  // Search functionality
  searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    fetchJobs();
  });

  // Add job form submission
  addJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addJobForm);
    const job = Object.fromEntries(formData.entries());

    fetch('http://localhost:3000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    })
      .then((response) => response.json())
      .then(() => {
        addJobForm.reset();
        fetchJobs();
      })
      .catch((error) => console.error('Error adding job:', error));
  });

  // Attach listeners to edit buttons
  const attachEditListeners = () => {
    document.querySelectorAll('.edit-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const jobId = e.target.dataset.id;
        // Implement edit functionality here
        console.log('Edit job:', jobId);
      });
    });
  };

  // Attach listeners to delete buttons
  const attachDeleteListeners = () => {
    document.querySelectorAll('.delete-button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const jobId = e.target.dataset.id;
        fetch(`http://localhost:3000/api/jobs/${jobId}`, { method: 'DELETE' })
          .then(() => fetchJobs())
          .catch((error) => console.error('Error deleting job:', error));
      });
    });
  };

  // Pagination controls
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchJobs();
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchJobs();
  });

  // Initial fetch
  fetchJobs();
});
