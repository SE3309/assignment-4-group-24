document.addEventListener("DOMContentLoaded", async () => {
    const clientsTable = document.getElementById("clientsTable");
    const addClientForm = document.getElementById("addClientForm");
  
    // Fetch and populate clients
    async function fetchClients() {
      try {
        const response = await fetch("http://localhost:3000/api/clients");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const clientsData = await response.json();
        populateClientsTable(clientsData);
      } catch (error) {
        console.error("Error fetching clients data:", error);
        clientsTable.innerHTML = `<tr><td colspan="4" class="py-2 px-4 text-red-500 text-center">Failed to load data.</td></tr>`;
      }
    }
  
   // Populate clients table
function populateClientsTable(clientsData) {
    clientsTable.innerHTML = "";
    clientsData.forEach((client) => {
      // Create client row
      const clientRow = document.createElement("tr");
      clientRow.className = "bg-gray-100 border-b";
      clientRow.innerHTML = `
        <td class="py-3 px-4 font-bold text-lg">${client.F_name} ${client.L_name}</td>
        <td class="py-3 px-4">${client.Email}</td>
        <td class="py-3 px-4">${client.Phone_No}</td>
        <td class="py-3 px-4">
          <button class="px-4 py-2 bg-blue-500 text-white rounded edit-client" data-id="${client.Client_ID}">Edit</button>
          <button class="px-4 py-2 bg-red-500 text-white rounded delete-client" data-id="${client.Client_ID}">Delete</button>
          <button class="px-4 py-2 bg-green-500 text-white rounded view-jobs" data-id="${client.Client_ID}">View Jobs</button>
        </td>
      `;
      clientsTable.appendChild(clientRow);
  
      // Create hidden row for jobs
      const jobsRow = document.createElement("tr");
      jobsRow.className = "hidden bg-gray-50 border-b";
      jobsRow.innerHTML = `
        <td colspan="4" class="py-3 px-4">
          <ul id="jobs-${client.Client_ID}" class="list-disc pl-5"></ul>
        </td>
      `;
      clientsTable.appendChild(jobsRow);
  
      // Attach event listener to "View Jobs" button
      clientRow.querySelector(".view-jobs").addEventListener("click", () => toggleJobs(client.Client_ID));
    });
  
    // Attach edit and delete event listeners
    document.querySelectorAll(".edit-client").forEach((button) => {
      button.addEventListener("click", () => editClient(button.dataset.id));
    });
    document.querySelectorAll(".delete-client").forEach((button) => {
      button.addEventListener("click", () => deleteClient(button.dataset.id));
    });
  document.querySelectorAll(".view-jobs").forEach(button => {
    button.addEventListener("click", () => viewJobs(button.dataset.id)); // Call the viewJobs function
  });
  }
  
  // Toggle jobs visibility
  async function toggleJobs(clientId) {
    const jobsRow = document.querySelector(`#jobs-${clientId}`).parentElement;
    if (jobsRow.classList.contains("hidden")) {
      // Fetch jobs if not already visible
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${clientId}/jobs`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await response.json();
  
        // Populate jobs list
        const jobsList = document.getElementById(`jobs-${clientId}`);
        jobsList.innerHTML = jobsData
          .map((job) => `<li>Job ID: ${job.Job_ID}, Type: ${job.Job_Type}</li>`)
          .join("");
  
        // Show the jobs row
        jobsRow.classList.remove("hidden");
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    } else {
      // Hide the jobs row
      jobsRow.classList.add("hidden");
    }
  }
  
  
    // Add a new client
    async function addClient(event) {
      event.preventDefault();
      const formData = new FormData(addClientForm);
      const newClient = {
        F_name: formData.get("F_name"),
        L_name: formData.get("L_name"),
        Email: formData.get("Email"),
        Phone_No: formData.get("Phone_No"),
      };
  
      try {
        const response = await fetch("http://localhost:3000/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });
        if (!response.ok) throw new Error("Failed to add client");
        fetchClients();
        addClientForm.reset();
      } catch (error) {
        console.error("Error adding client:", error);
      }
    }
  
    // Edit a client
    async function editClient(clientId) {
      const newDetails = prompt("Enter new details in format: FirstName, LastName, Email, PhoneNo");
      if (!newDetails) return;
  
      const [F_name, L_name, Email, Phone_No] = newDetails.split(", ");
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ F_name, L_name, Email, Phone_No }),
        });
        if (!response.ok) throw new Error("Failed to update client");
        fetchClients();
      } catch (error) {
        console.error("Error updating client:", error);
      }
    }
  
    // Delete a client
    async function deleteClient(clientId) {
      if (!confirm("Are you sure you want to delete this client?")) return;
  
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete client");
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  
    // Event listener for adding a new client
    addClientForm.addEventListener("submit", addClient);
  
    // Initial fetch
    fetchClients();
  });
  // View jobs by clientasync function viewJobs(clientId) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${clientId}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    const jobs = await response.json();

    const jobsModal = document.getElementById('jobsModal');
    const jobsModalContent = document.getElementById('jobsModalContent');

    // Populate the modal content
    jobsModalContent.innerHTML = `
      <h3 class="text-lg font-semibold">Jobs for Client ID: ${clientId}</h3>
      <ul class="list-disc pl-5">
        ${jobs.map(job => `<li>Job ID: ${job.Job_ID}, Type: ${job.Job_Type}</li>`).join('')}
      </ul>
    `;

    // Show the modal
    jobsModal.classList.remove('hidden');
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}

// Add event listener to close the modal
document.getElementById('closeJobsModal').addEventListener('click', () => {
  document.getElementById('jobsModal').classList.add('hidden');
});
