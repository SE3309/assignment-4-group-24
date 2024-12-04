document.addEventListener('DOMContentLoaded', () => {
  const jobsTableBody = document.querySelector('#jobs-table-body');
  const jobModal = document.getElementById('job-modal');
  const jobForm = document.getElementById('job-form');
  const cancelModalButton = document.getElementById('cancel-modal');
  const addJobButton = document.getElementById('toggle-add-job');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const searchBar = document.getElementById('search-bar');
  const resetFiltersButton = document.getElementById('reset-filters');
  const sortButtons = {
    startDate: document.getElementById('sort-start-date'),
    endDate: document.getElementById('sort-end-date'),
    client: document.getElementById('sort-client'),
  };

  let currentPage = 1; // Initialize currentPage
  const rowsPerPage = 25; // Rows per page
  let primarySortKey = 'Start_Date'; // Default sorting column
  let sortOrder = 'ASC'; // Default sorting order
  let searchTerm = ''; // Search filter term
  let isEditing = false; // Track if the modal is in edit mode

  // Fetch jobs from the server
  const fetchJobs = () => {
    const offset = (currentPage - 1) * rowsPerPage;
  
    const query = `limit=${rowsPerPage}&offset=${offset}&primarySortKey=${primarySortKey}&sortOrder=${sortOrder}&search=${encodeURIComponent(
      searchTerm
    )}`;
    fetch(`http://localhost:3000/api/jobs?${query}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch jobs');
        return response.json();
      })
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
    jobsTableBody.innerHTML = '';
    jobs.forEach((job) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${job.Job_ID}</td>
        <td>${job.Client_ID}</td>
        <td>${job.Number_Of_Trucks}</td>
        <td>${job.Start_Date}</td>
        <td>${job.End_Date || 'N/A'}</td>
        <td>${job.job_status ? 'Completed' : 'In Progress'}</td>
        <td>
          <button class="view-button" data-id="${job.Job_ID}">View</button>
          <button class="edit-button" data-id="${job.Job_ID}">Edit</button>
          <button class="delete-button" data-id="${job.Job_ID}">Delete</button>
        </td>
      `;
      jobsTableBody.appendChild(row);
    });
  
    attachViewListeners();
    attachEditListeners();
    attachDeleteListeners();
  };
  
  const attachViewListeners = () => {
    document.querySelectorAll('.view-button').forEach((button) => {
      button.addEventListener('click', () => {
        const jobId = button.dataset.id;
        fetch(`http://localhost:3000/api/jobs/${jobId}`)
          .then((response) => response.json())
          .then((job) => {
            // Display job details in a modal or alert
            alert(`
              Job ID: ${job.Job_ID}
              Client ID: ${job.Client_ID}
              Dispatcher ID: ${job.Dispatcher_ID}
              Job Type: ${job.Job_Type}
              Number of Trucks: ${job.Number_Of_Trucks}
              Start Date: ${job.Start_Date}
              End Date: ${job.End_Date || 'N/A'}
              Status: ${job.job_status ? 'Completed' : 'In Progress'}
              Pickup Address: ${job.p_address}, ${job.p_city}, ${job.p_state_province}, ${job.p_country}, ${job.p_zip_code}
              Dropoff Address: ${job.d_address}, ${job.d_city}, ${job.d_state_province}, ${job.d_country}, ${job.d_zip_code}
            `);
          })
          .catch((error) => console.error('Error fetching job details:', error));
      });
    });
  };
  

  

  // Update pagination buttons
  const updatePaginationButtons = (rowCount) => {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = rowCount < rowsPerPage;
  };

  // Open the modal for adding or editing a job
  const openModal = (job = null) => {
    isEditing = !!job;
    jobModal.classList.remove('hidden');

    if (job) {
      document.getElementById('Job_ID').value = job.Job_ID;
      document.getElementById('Client_ID').value = job.Client_ID;
      document.getElementById('Number_Of_Trucks').value = job.Number_Of_Trucks;
      document.getElementById('Start_Date').value = job.Start_Date;
      document.getElementById('End_Date').value = job.End_Date;
      document.getElementById('job_status').value = job.job_status;
    } else {
      jobForm.reset();
    }
  };

  // Close the modal
  const closeModal = () => {
    jobModal.classList.add('hidden');
    jobForm.reset();
  };

  // Handle form submission for add/edit job
  jobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(jobForm);
    const job = Object.fromEntries(formData.entries());

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:3000/api/jobs/${job.Job_ID}` : 'http://localhost:3000/api/jobs';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save job');
        closeModal();
        fetchJobs();
      })
      .catch((error) => console.error('Error saving job:', error));
  });

  cancelModalButton.addEventListener('click', closeModal);
  addJobButton.addEventListener('click', () => openModal());

  // Attach event listeners to edit buttons
  const attachEditListeners = () => {
    document.querySelectorAll('.edit-button').forEach((button) => {
      button.addEventListener('click', () => {
        const jobId = button.dataset.id;
        fetch(`http://localhost:3000/api/jobs/${jobId}`)
          .then((response) => response.json())
          .then((job) => openModal(job))
          .catch((error) => console.error('Error fetching job:', error));
      });
    });
  };

  // Attach event listeners to delete buttons
  const attachDeleteListeners = () => {
    document.querySelectorAll('.delete-button').forEach((button) => {
      button.addEventListener('click', () => {
        const jobId = button.dataset.id;
        fetch(`http://localhost:3000/api/jobs/${jobId}`, { method: 'DELETE' })
          .then(() => fetchJobs())
          .catch((error) => console.error('Error deleting job:', error));
      });
    });
  };

  // Handle pagination
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

  // Handle sorting
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

  // Handle reset filters
  resetFiltersButton.addEventListener('click', () => {
    currentPage = 1;
    primarySortKey = 'Start_Date';
    sortOrder = 'ASC';
    searchTerm = '';
    searchBar.value = '';
    fetchJobs();
  });

  // Handle search
  searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    fetchJobs();
  });

  // Fetch jobs on page load
  fetchJobs();
});
