document.addEventListener('DOMContentLoaded', () => {
  const driversTableBody = document.querySelector('#drivers-table-body');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const currentPageDisplay = document.getElementById('current-page');
  const resetFiltersButton = document.getElementById('reset-filters');
  const searchBar = document.getElementById('search-bar');
  const addDriverForm = document.getElementById('add-driver-form'); // Form for adding drivers

  const sortButtons = {
    name: document.getElementById('sort-name'),
    license: document.getElementById('sort-license'),
    availability: document.getElementById('sort-availability'),
  };

  let currentPage = 1;
  const rowsPerPage = 25;
  let primarySortKey = 'Driver_ID'; // Default primary sorting column
  let secondarySortKey = ''; // Default secondary sorting column (none)
  let sortOrder = 'ASC'; // Default sort order
  let searchTerm = '';

  // Fetch drivers from the API
  const fetchDrivers = () => {
    const offset = (currentPage - 1) * rowsPerPage;

    const query = `limit=${rowsPerPage}&offset=${offset}&primarySortKey=${primarySortKey}&secondarySortKey=${secondarySortKey}&sortOrder=${sortOrder}&search=${encodeURIComponent(searchTerm)}`;
    console.log(`API Call: /api/drivers?${query}`); // Debugging the API call

    fetch(`http://localhost:3000/api/drivers?${query}`)
      .then(response => response.json())
      .then(data => {
        populateDriversTable(data);
        updatePaginationButtons(data.length);
      })
      .catch(error => {
        console.error('Error fetching drivers:', error);
        driversTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Failed to load drivers</td></tr>';
      });
  };

  const populateDriversTable = (drivers) => {
    driversTableBody.innerHTML = ''; // Clear the table
    drivers.forEach(driver => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <tr>
          <td>${driver.Driver_ID}</td>
          <td contenteditable="true" class="editable" data-field="F_Name">${driver.F_Name}</td>
          <td contenteditable="true" class="editable" data-field="L_Name">${driver.L_Name}</td>
          <td contenteditable="true" class="editable" data-field="License_Type">${driver.License_Type}</td>
          <td>
            <select class="availability-select" data-field="Availability" data-driver-id="${driver.Driver_ID}">
              <option value="1" ${driver.Availability ? 'selected' : ''}>Available</option>
              <option value="0" ${!driver.Availability ? 'selected' : ''}>Unavailable</option>
            </select>
          </td>
          <td contenteditable="true" class="editable" data-field="Phone_No">${driver.Phone_No}</td>
          <td>${driver.Dispatcher_ID || 'N/A'}</td>
          <td>
            <button class="save-button px-2 py-1 bg-green-500 text-white rounded" data-driver-id="${driver.Driver_ID}">Save</button>
            <button class="delete-button px-2 py-1 bg-red-500 text-white rounded" data-driver-id="${driver.Driver_ID}">Delete</button>
          </td>
        </tr>`;
      driversTableBody.appendChild(row);
    });

    attachSaveButtonListeners();
    attachDeleteButtonListeners();
  };

  const updatePaginationButtons = (fetchedRowCount) => {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = fetchedRowCount < rowsPerPage;
    currentPageDisplay.textContent = `Page ${currentPage}`;
  };

  resetFiltersButton.addEventListener('click', () => {
    currentPage = 1;
    primarySortKey = 'Driver_ID';
    secondarySortKey = '';
    sortOrder = 'ASC';
    searchTerm = '';
    searchBar.value = '';
    fetchDrivers();
  });

  Object.entries(sortButtons).forEach(([key, button]) => {
    button.addEventListener('click', () => {
      const keyToColumn = {
        name: 'F_Name',
        license: 'License_Type',
        availability: 'Availability',
      };

      if (primarySortKey === keyToColumn[key]) {
        // If the same sort button is clicked, toggle the sort order
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        // Otherwise, set it as the primary key and reset secondary sort
        secondarySortKey = primarySortKey;
        primarySortKey = keyToColumn[key];
        sortOrder = 'ASC'; // Default to ascending for a new primary sort
      }

      currentPage = 1;
      fetchDrivers();
    });
  });

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchDrivers();
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchDrivers();
  });

  searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    fetchDrivers();
  });

  // Add driver form submission
  addDriverForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addDriverForm);
    const driver = Object.fromEntries(formData.entries());

    fetch('http://localhost:3000/api/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert('Driver added successfully!');
          addDriverForm.reset(); // Clear the form
          fetchDrivers(); // Refresh the driver list
        }
      })
      .catch(error => {
        console.error('Error adding driver:', error);
        alert('Failed to add driver');
      });
  });

  const attachSaveButtonListeners = () => {
    document.querySelectorAll('.save-button').forEach(button => {
      button.addEventListener('click', (event) => {
        const driverId = event.target.getAttribute('data-driver-id');
        const row = event.target.closest('tr');
        const updatedDriver = {};

        row.querySelectorAll('.editable').forEach(cell => {
          const field = cell.getAttribute('data-field');
          updatedDriver[field] = cell.textContent.trim();
        });

        const availabilitySelect = row.querySelector('.availability-select');
        updatedDriver['Availability'] = parseInt(availabilitySelect.value, 10);
        updatedDriver['Driver_ID'] = driverId;

        // Confirmation alert
        const confirmSave = confirm('Are you sure you want to save changes to this driver?');
        if (!confirmSave) return;

        fetch(`http://localhost:3000/api/drivers/${driverId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedDriver),
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(`Error: ${data.error}`);
            } else {
              alert('Driver updated successfully!');
              fetchDrivers(); // Refresh the driver list
            }
          })
          .catch(error => {
            console.error('Error updating driver:', error);
            alert('Failed to update driver');
          });
      });
    });
  };

  const attachDeleteButtonListeners = () => {
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', (event) => {
        const driverId = event.target.getAttribute('data-driver-id');

        // Confirmation alert
        const confirmDelete = confirm('Are you sure you want to delete this driver?');
        if (!confirmDelete) return;

        fetch(`http://localhost:3000/api/drivers/${driverId}`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(`Error: ${data.error}`);
            } else {
              alert('Driver deleted successfully!');
              fetchDrivers(); // Refresh the driver list
            }
          })
          .catch(error => {
            console.error('Error deleting driver:', error);
            alert('Failed to delete driver');
          });
      });
    });
  };

  
  const fetchDriverDetails = (driverId) => {
    console.log('Fetching driver details for ID:', driverId); // Debugging
    fetch(`http://localhost:3000/api/drivers/${driverId}/details`)
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); // Debugging
        if (data.error) {
          alert(data.error); // Show error if driver is not found
        } else {
          displayDriverDetails(data); // Pass the data to the display function
        }
      })
      .catch(error => console.error('Error fetching driver details:', error));
  };
  window.fetchDriverDetails = fetchDriverDetails;

// Function to display driver details in the UI
const displayDriverDetails = (driver) => {
  const detailsContainer = document.getElementById('driver-details');
  detailsContainer.innerHTML = `
    <div class="p-4 bg-gray-100 rounded">
      <h3 class="text-lg font-bold">Driver Details</h3>
      <p><strong>ID:</strong> ${driver.Driver_ID}</p>
      <p><strong>Name:</strong> ${driver.F_Name} ${driver.L_Name}</p>
      <p><strong>License Type:</strong> ${driver.License_Type}</p>
      <p><strong>Phone:</strong> ${driver.Phone_No}</p>
      <p><strong>Next Available Date:</strong> ${"12/24/25"}</p>
    </div>
  `;
};

// Function to fetch completed jobs
const fetchCompletedJobs = (driverId) => {
  console.log('Fetching completed jobs for Driver_ID:', driverId);

  fetch(`http://localhost:3000/api/drivers/${driverId}/completed-jobs`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        displayCompletedJobs(data);
      }
    })
    .catch(error => console.error('Error fetching completed jobs:', error));
};

// Function to display completed jobs
const displayCompletedJobs = (data) => {
  const outputContainer = document.getElementById('completed-jobs-output');
  outputContainer.innerHTML = `
    <div class="p-4 bg-gray-100 rounded">
      <h3 class="text-lg font-bold">Completed Jobs</h3>
      <p><strong>Driver ID:</strong> ${data.Driver_ID}</p>
      <p><strong>Name:</strong> ${data.F_Name} ${data.L_Name}</p>
      <p><strong>Total Completed Jobs:</strong> ${data.Total_Completed_Jobs}</p>
    </div>
  `;
};

// Expose function to the global scope
window.fetchCompletedJobs = fetchCompletedJobs;


  // Initial fetch
  fetchDrivers();
});
