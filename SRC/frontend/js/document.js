// Fetch and display documents
async function fetchDocuments() {
  try {
    const response = await fetch('http://localhost:3000/documents');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const documents = await response.json();
    const tableBody = document.getElementById('document-table-body');
    tableBody.innerHTML = '';

    documents.forEach(doc => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doc.Type}</td>
        <td>${doc.Document_ID}</td>
        <td>${doc.Document_Type}</td>
        <td>${doc.Created_At}</td>
        <td>${doc.File_Path}</td>
        <td>
          <button onclick="editDocument('${doc.Type}', ${doc.Document_ID})">Edit</button>
          <button onclick="deleteDocument('${doc.Type}', ${doc.Document_ID})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Add a document
document.getElementById('add-document-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const documentType = document.getElementById('document-type').value;
  const filePath = document.getElementById('file-path').value;

  const response = await fetch('http://localhost:3000/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, documentType, filePath }),
  });

  if (response.ok) {
    alert('Document added successfully!');
    fetchDocuments();
  } else {
    alert('Error adding document.');
  }
});

// Edit a document
async function editDocument(type, id) {
  const newType = prompt('Enter new document type:');
  const newPath = prompt('Enter new file path:');
  if (newType && newPath) {
    const response = await fetch(`http://localhost:3000/documents/${type}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Document_Type: newType, File_Path: newPath }),
    });

    if (response.ok) {
      alert('Document updated.');
      fetchDocuments();
    } else {
      alert('Error updating document.');
    }
  }
}

// Delete a document
async function deleteDocument(type, id) {
  if (confirm('Are you sure you want to delete this document?')) {
    const response = await fetch(`http://localhost:3000/documents/${type}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Document deleted.');
      fetchDocuments();
    } else {
      alert('Error deleting document.');
    }
  }
}

async function editDocument(type, id) {
  const documentType = prompt('Enter new Document Type (leave blank to keep unchanged):');
  const filePath = prompt('Enter new File Path (leave blank to keep unchanged):');
  const dispatcherId = prompt('Enter new Dispatcher ID (leave blank to keep unchanged):');
  const jobId = type === 'Client' ? prompt('Enter new Job ID (leave blank to keep unchanged):') : null;
  const driverId = type === 'Driver' ? prompt('Enter new Driver ID (leave blank to keep unchanged):') : null;
  const truckId = type === 'Truck' ? prompt('Enter new Truck ID (leave blank to keep unchanged):') : null;

  const body = {};
  if (documentType) body.documentType = documentType;
  if (filePath) body.filePath = filePath;
  if (dispatcherId) body.dispatcherId = dispatcherId;
  if (jobId) body.jobId = jobId;
  if (driverId) body.driverId = driverId;
  if (truckId) body.truckId = truckId;

  const response = await fetch(`http://localhost:3000/documents/${type}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    alert('Document updated successfully!');
    fetchDocuments();
  } else {
    const error = await response.json();
    alert(`Error: ${error.error}`);
  }
}

async function fetchDocuments(filterType = 'All') {
  try {
    let url = 'http://localhost:3000/documents';
    if (filterType !== 'All') {
      url += `?type=${filterType}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const documents = await response.json();

    const tableBody = document.getElementById('document-table-body');
    tableBody.innerHTML = '';

    documents.forEach(doc => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${doc.Type}</td>
        <td>${doc.Document_ID}</td>
        <td>${doc.Document_Type}</td>
        <td>${doc.Created_At}</td>
        <td>${doc.File_Path}</td>
        <td class="text-center">
          <button onclick="editDocument('${doc.Type}', ${doc.Document_ID})" class="text-blue-500 hover:underline">Edit</button>
          <button onclick="deleteDocument('${doc.Type}', ${doc.Document_ID})" class="text-red-500 hover:underline">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Filter functionality
document.getElementById('filter-button').addEventListener('click', () => {
  const filterType = document.getElementById('filter-type').value;
  fetchDocuments(filterType);
});

// Fetch documents on page load
window.onload = () => fetchDocuments();

// Fetch documents when the page loads
window.onload = fetchDocuments;
