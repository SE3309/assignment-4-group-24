// Fetch and display trucks
async function fetchTrucks() {
    try {
      const response = await fetch('http://localhost:3000/trucks');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const trucks = await response.json();
      console.log('Fetched trucks:', trucks);
  
      const tableBody = document.getElementById('truck-table-body');
      tableBody.innerHTML = '';
  
      if (trucks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No trucks found.</td></tr>';
      } else {
        trucks.forEach(truck => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${truck.Truck_ID}</td>
            <td>${truck.License_Plate}</td>
            <td>${truck.Truck_Brand}</td>
            <td>${truck.Max_Capacity}</td>
            <td>${truck.Total_Driven}</td>
            <td>${truck.Availability}</td>
            <td>${truck.Last_Service_Date ? truck.Last_Service_Date : 'N/A'}</td>
            <td>
              <button onclick="viewTruckDetails(${truck.Truck_ID})">View</button>
              <button onclick="editTruck(${truck.Truck_ID})">Edit</button>
              <button onclick="deleteTruck(${truck.Truck_ID})">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  }
  
  
  // Corrected fetch truck details function
async function viewTruckDetails(id) {
    try {
      const response = await fetch(`http://localhost:3000/trucks/${id}`);
      const truck = await response.json();
      alert(`
        Truck Details:
        ID: ${truck.Truck_ID}
        License Plate: ${truck.License_Plate}
        Brand: ${truck.Truck_Brand}
        Max Capacity: ${truck.Max_Capacity}
        Total Driven: ${truck.Total_Driven}
        Availability: ${truck.Availability}
        Last Service Date: ${truck.Last_Service_Date}
        Dispatcher ID: ${truck.Dispatcher_ID}
      `);
    } catch (error) {
      console.error('Error fetching truck details:', error);
    }
  }
  
  
  // Add a truck
  document.getElementById('add-truck-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const truckData = {
      License_Plate: formData.get('license-plate'),
      Truck_Brand: formData.get('truck-brand'),
      Max_Capacity: formData.get('max-capacity'),
      Total_Driven: formData.get('total-driven'),
      Availability: formData.get('availability'),
      Last_Service_Date: formData.get('last-service-date'),
      Dispatcher_ID: formData.get('dispatcher-id')
    };
  
    const response = await fetch('http://localhost:3000/trucks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(truckData),
    });
  
    if (response.ok) {
      alert('Truck added successfully!');
      fetchTrucks();
    } else {
      alert('Error adding truck.');
    }
  });
  
  // Fetch current truck details for editing
async function fetchTruckDetails(id) {
    try {
      const response = await fetch(`http://localhost:3000/trucks/${id}`);
      const truck = await response.json();
      return truck;
    } catch (error) {
      console.error('Error fetching truck details:', error);
    }
  }
  
  // Edit a truck
  async function editTruck(id) {
    // Fetch current truck details to pre-fill the prompts
    const truck = await fetchTruckDetails(id);
  
    // Prompt for each field, pre-filling with the current values
    const newLicensePlate = prompt('Enter new license plate:', truck.License_Plate);
    const newBrand = prompt('Enter new brand:', truck.Truck_Brand);
    const newMaxCapacity = prompt('Enter new max capacity:', truck.Max_Capacity);
    const newTotalDriven = prompt('Enter new total driven:', truck.Total_Driven);
    const newAvailability = prompt('Enter new availability (e.g., "Available", "Not Available"):', truck.Availability);
    const newLastServiceDate = prompt('Enter new last service date (YYYY-MM-DD):', truck.Last_Service_Date);
    const newDispatcherID = prompt('Enter new dispatcher ID:', truck.Dispatcher_ID);
  
    // Update truck object with new values
    const updatedTruck = {
      License_Plate: newLicensePlate,
      Truck_Brand: newBrand,
      Max_Capacity: newMaxCapacity,
      Total_Driven: newTotalDriven,
      Availability: newAvailability,
      Last_Service_Date: newLastServiceDate,
      Dispatcher_ID: newDispatcherID
    };
  
    // Send the updated truck details to the server
    const response = await fetch(`http://localhost:3000/trucks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTruck)
    });
  
    if (response.ok) {
      alert('Truck updated.');
      fetchTrucks();  // Refresh the trucks list
    } else {
      alert('Error updating truck.');
    }
  }
  

  
  // Delete a truck
  async function deleteTruck(id) {
    if (confirm('Are you sure you want to delete this truck?')) {
      const response = await fetch(`http://localhost:3000/trucks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Truck deleted.');
        fetchTrucks();
      } else {
        alert('Error deleting truck.');
      }
    }
  }
  
  // Fetch trucks when the page loads
  window.onload = fetchTrucks;
  