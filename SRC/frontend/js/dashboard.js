document.addEventListener('DOMContentLoaded', () => {
  const profileInitialsDiv = document.getElementById('profile-initials');
  const logoutButton = document.getElementById('logout-button');
  const trucksCountElement = document.getElementById('trucks-count');
  const driversCountElement = document.getElementById('drivers-count');

  // Function to fetch dispatcher details from local storage
  function getDispatcherDetails() {
    const dispatcher = localStorage.getItem('dispatcher');
    return dispatcher ? JSON.parse(dispatcher) : null;
  }

  // Function to set dispatcher initials dynamically
  function setDispatcherInitials(dispatcher) {
    if (dispatcher && dispatcher.firstName && dispatcher.lastName) {
      const initials = `${dispatcher.firstName[0]}${dispatcher.lastName[0]}`.toUpperCase();
      profileInitialsDiv.textContent = initials;
    } else {
      profileInitialsDiv.textContent = 'NA'; // Default if no dispatcher details are available
    }
  }

  // Fetch dashboard data
  async function fetchDashboardData() {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/data');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    } catch (err) {
      console.error(err);
      alert('Error loading dashboard data');
    }
  }
  // Set trucks and drivers counts in the chart
  async function updateDashboardChart() {
    const data = await fetchDashboardData();
    if (data) {
      trucksCountElement.textContent = data.availableTrucks || 0;
      driversCountElement.textContent = data.availableDrivers || 0;
    }
  }
  // Fetch dispatcher details and set initials
  const dispatcher = getDispatcherDetails();
  setDispatcherInitials(dispatcher);
  updateDashboardChart();


  // Logout functionality
  logoutButton.addEventListener('click', () => {
    alert('Logging out...');
    // Clear local storage or session storage for dispatcher
    localStorage.removeItem('dispatcher');
    // Redirect to login page
    window.location.href = 'login.html';
  });
});



document.getElementById('generateReportButton').addEventListener('click', async () => {
  const truckId = document.getElementById('truckIdInput').value;

  if (!truckId) {
      alert('Please enter a Truck ID');
      return;
  }

  try {
      const response = await fetch('http://localhost:3000/api/dashboard/expenses/' + truckId);
      if (!response.ok) {
          const error = await response.json();
          alert(error.message || 'Error fetching expense report');
          return;
      }

      const expenses = await response.json();
      const reportContainer = document.getElementById('reportContainer');
      reportContainer.innerHTML = `
          <table>
              <tr>
                  <th>Expense ID</th>
                  <th>Job ID</th>
                  <th>Truck ID</th>
                  <th>Fuel Cost</th>
                  <th>Toll Cost</th>
                  <th>Other Expenses</th>
                  <th>Total Cost</th>
                  <th>Date</th>
                  <th>License Plate</th>
                  <th>Truck Brand</th>
              </tr>
              ${expenses.map(expense => `
                  <tr>
                      <td>${expense.Expense_ID}</td>
                      <td>${expense.Job_ID}</td>
                      <td>${expense.Truck_ID}</td>
                      <td>${expense.Fuel_Cost}</td>
                      <td>${expense.Toll_Cost}</td>
                      <td>${expense.Other_Expenses}</td>
                      <td>${expense.Total_Cost}</td>
                      <td>${expense.Date}</td>
                      <td>${expense.License_Plate}</td>
                      <td>${expense.Truck_Brand}</td>
                  </tr>
              `).join('')}
          </table>
      `;
  } catch (error) {
      console.error(error);
      alert('An error occurred while generating the report');
  }
});
