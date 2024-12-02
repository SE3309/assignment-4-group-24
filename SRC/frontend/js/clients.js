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
      clientsTable.innerHTML = ""; // Clear existing rows
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
  
        // Create jobs row (hidden by default)
        const jobsRow = document.createElement("tr");
        jobsRow.className = "hidden bg-gray-50 border-b";
        jobsRow.innerHTML = `
          <td colspan="4" class="py-3 px-4">
            <ul id="jobs-${client.Client_ID}" class="list-disc pl-5"></ul>
          </td>
        `;
  
        // Append rows to table
        clientsTable.appendChild(clientRow);
        clientsTable.appendChild(jobsRow);
  
        // Attach event listeners to buttons
        attachEventListeners(client, clientRow, jobsRow);
      });
    }
  
    // Attach event listeners for buttons
    function attachEventListeners(client, clientRow, jobsRow) {
      // View Jobs button
      const viewJobsButton = clientRow.querySelector(".view-jobs");
      viewJobsButton.addEventListener("click", () => toggleJobs(client.Client_ID, jobsRow));
  
      // Edit Client button
      const editButton = clientRow.querySelector(".edit-client");
      editButton.addEventListener("click", () => editClient(client.Client_ID));
  
      // Delete Client button
      const deleteButton = clientRow.querySelector(".delete-client");
      deleteButton.addEventListener("click", () => deleteClient(client.Client_ID));
    }
  
    // Toggle jobs visibility
    async function toggleJobs(clientId, jobsRow) {
      if (jobsRow.classList.contains("hidden")) {
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
        jobsRow.classList.add("hidden");
      }
    }
  
    async function addClient(event) {
        event.preventDefault();
        const formData = new FormData(document.getElementById("addClientForm"));
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
      
          if (!response.ok) {
            throw new Error("Failed to add client");
          }
      
          fetchClients(); // Reload the clients table
          alert("Client added successfully.");
        } catch (error) {
          console.error("Error adding client:", error);
        }
      }
      
  
      async function editClient(clientId) {
        const newDetails = prompt("Enter new details (format: FirstName, LastName, Email, PhoneNo)");
        if (!newDetails) return;
      
        const [F_name, L_name, Email, Phone_No] = newDetails.split(", ");
        const updatedClient = { F_name, L_name, Email, Phone_No };
      
        try {
          const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedClient),
          });
      
          if (!response.ok) {
            throw new Error("Failed to update client");
          }
      
          fetchClients();
          alert("Client updated successfully.");
        } catch (error) {
          console.error("Error updating client:", error);
        }
      }
      
      async function deleteClient(clientId) {
        if (!confirm("Are you sure you want to delete this client?")) return;
      
        try {
          const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
            method: "DELETE",
          });
      
          if (!response.ok) {
            throw new Error("Failed to delete client");
          }
      
          fetchClients();
          alert("Client deleted successfully.");
        } catch (error) {
          console.error("Error deleting client:", error);
        }
      }
      
  
  
    // Event listener for adding a client
    addClientForm.addEventListener("submit", addClient);
  
    // Initial fetch
    fetchClients();
  });
  