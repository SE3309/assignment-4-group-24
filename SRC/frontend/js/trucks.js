// Fetch and display trucks
async function fetchTrucks() {
    try {
      const response = await fetch('http://localhost:3000/trucks');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const trucks = await response.json();
      const tableBody = document.getElementById('truck-table-body');
      tableBody.innerHTML = '';
  
      trucks.forEach(truck => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${truck.Truck_ID}</td>
          <td>${truck.License_Plate}</td>
          <td>${truck.Availability === 0 ? 'Available' : 'Not Available'}</td>
          <td>
            <button 
              class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onclick="viewTruckDetails(${truck.Truck_ID})">
              View
            </button>
            <button 
              class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onclick="editTruck(${truck.Truck_ID})">
              Edit
            </button>
            <button 
              class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onclick="deleteTruck(${truck.Truck_ID})">
              Delete
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
      
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  }
  
  // Fetch truck details for editing
  async function fetchTruckDetails(id) {
    try {
      const response = await fetch(`http://localhost:3000/trucks/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching truck details:', error);
    }
  }

  // Fetch and display detailed truck information in a modal or separate section
async function viewTruckDetails(id) {
    try {
      const response = await fetch(`http://localhost:3000/trucks/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching truck details: ${response.statusText}`);
      }
  
      const truck = await response.json();
      
      // Check if the truck exists
      if (!truck) {
        alert('Truck details not found.');
        return;
      }
  
      // Display truck details (e.g., in a modal or a dedicated section)
      const truckDetailsSection = document.createElement('div');
      truckDetailsSection.innerHTML = `
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 class="text-xl font-bold mb-4">Truck Details</h2>
            <p><strong>Truck ID:</strong> ${truck.Truck_ID}</p>
            <p><strong>License Plate:</strong> ${truck.License_Plate}</p>
            <p><strong>Brand Name:</strong> ${truck.Truck_Brand}</p>
            <p><strong>Max Capacity:</strong> ${truck.Max_Capacity}</p>
            <p><strong>Total Driven:</strong> ${truck.Total_Driven}</p>
            <p><strong>Availability:</strong> ${truck.Availability === 0 ? 'Available' : 'Not Available'}</p>
            <p><strong>Last Service Date:</strong> ${truck.Last_Service_Date || 'N/A'}</p>
            <p><strong>Dispatcher ID:</strong> ${truck.Dispatcher_ID}</p>
            <button class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onclick="closeDetails()">Close</button>
          </div>
        </div>
      `;
  
      document.body.appendChild(truckDetailsSection);
    } catch (error) {
      console.error('Error fetching truck details:', error);
      alert('Failed to fetch truck details. Please try again.');
    }
  }
  
  // Function to close the details modal
  function closeDetails() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
      modal.remove();
    }
  }
  
  
  async function editTruck(id) {
    // Fetch current truck details to pre-fill the prompts
    const truck = await fetchTruckDetails(id);
  
    if (!truck) {
      alert('Unable to fetch truck details.');
      return;
    }
  
    // Prompt for each field, pre-filling with the current values
    const newLicensePlate = prompt('Enter new license plate:', truck.License_Plate) || truck.License_Plate;
    const newBrand = prompt('Enter new brand:', truck.Truck_Brand) || truck.Truck_Brand;
    const newMaxCapacity = prompt('Enter new max capacity:', truck.Max_Capacity) || truck.Max_Capacity;
    const newTotalDriven = prompt('Enter new total driven:', truck.Total_Driven) || truck.Total_Driven;
    const newAvailability = prompt('Enter new availability (0 for Available, 1 for Not Available):', truck.Availability) || truck.Availability;
    const newLastServiceDate = prompt('Enter new last service date (YYYY-MM-DD):', truck.Last_Service_Date) || truck.Last_Service_Date;
    const newDispatcherID = prompt('Enter new dispatcher ID:', truck.Dispatcher_ID) || truck.Dispatcher_ID;
  
    // Updated truck object with new or existing values
    const updatedTruck = {
      License_Plate: newLicensePlate,
      Truck_Brand: newBrand,
      Max_Capacity: newMaxCapacity,
      Total_Driven: newTotalDriven,
      Availability: newAvailability,
      Last_Service_Date: newLastServiceDate,
      Dispatcher_ID: newDispatcherID,
    };
  
    // Send the updated truck details to the server
    try {
      const response = await fetch(`http://localhost:3000/trucks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTruck),
      });
  
      if (response.ok) {
        alert('Truck updated successfully.');
        fetchTrucks(); // Refresh the trucks list
      } else {
        const error = await response.json();
        alert(`Error updating truck: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating truck:', error);
      alert('An error occurred while updating the truck.');
    }
  }
  
  
  
  // Delete a truck
async function deleteTruck(id) {
    if (confirm('Are you sure you want to delete this truck?')) {
      try {
        const response = await fetch(`http://localhost:3000/trucks/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Truck deleted successfully!');
          fetchTrucks();
        } else {
          const errorData = await response.json();
          alert(`Error deleting truck: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting truck:', error);
      }
    }
  }
  
  async function fetchTruckWithMostJobs(month, year) {
    try {
      const response = await fetch(`http://localhost:3000/trucks/most-jobs?month=${month}&year=${year}`);
  
      if (!response.ok) {
        const errorMessage = await response.text(); // Read error message from backend
        throw new Error(errorMessage || `Error fetching truck with most jobs: ${response.statusText}`);
      }
  
      const truck = await response.json();
  
      const container = document.getElementById('most-jobs-container');
      if (!container) {
        console.error('Element with id "most-jobs-container" not found in the DOM.');
        return;
      }
  
      if (truck.message) {
        // If no truck is found
        container.innerHTML = `
          <p class="text-gray-500">No jobs found for the specified month and year.</p>
        `;
      } else {
        // Truck found
        container.innerHTML = `
          <h3 class="text-lg font-semibold mb-2">Truck with Most Jobs (${month}/${year})</h3>
          <p><strong>Truck ID:</strong> ${truck.Truck_ID}</p>
          <p><strong>License Plate:</strong> ${truck.License_Plate}</p>
          <p><strong>Brand:</strong> ${truck.Truck_Brand}</p>
          <p><strong>Total Jobs:</strong> ${truck.Total_Jobs}</p>
        `;
      }
    } catch (error) {
      console.error('Error fetching truck with most jobs:', error);
  
      const container = document.getElementById('most-jobs-container');
      if (container) {
        container.innerHTML = `
          <p class="text-red-500">Failed to fetch truck with most jobs. Please try again later.</p>
        `;
      }
    }
  }
  

// Handle the form submission
document.getElementById('most-jobs-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission from reloading the page
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;

    // Validate the inputs
    if (!month || !year) {
        alert('Please provide both month and year.');
        return;
    }

    fetchTruckWithMostJobs(month, year);
});

document.addEventListener('DOMContentLoaded', () => {
    fetchTrucks();
  
    // Attach event listener for the form
    document.getElementById('most-jobs-form').addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent page reload
      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;
  
      // Validate the inputs
      if (!month || !year) {
        alert('Please provide both month and year.');
        return;
      }
  
      fetchTruckWithMostJobs(month, year); // Fetch truck data
    });
  });
  