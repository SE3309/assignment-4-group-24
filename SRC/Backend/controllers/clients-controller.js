const db = require('../db'); // Database connection file

// Fetch all clients
exports.fetchAllClients = (req, res) => {
    const query = `
      SELECT 
        Clients.Client_ID, 
        Clients.F_name, 
        Clients.L_name, 
        Clients.Email, 
        Clients.Phone_No,
        JSON_ARRAYAGG(JSON_OBJECT('Job_ID', Jobs.Job_ID, 'Job_Type', Jobs.Job_Type)) AS jobs
      FROM 
        Clients
      LEFT JOIN 
        Jobs ON Clients.Client_ID = Jobs.Client_ID
      GROUP BY 
        Clients.Client_ID;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching clients:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // No need to parse JSON; the data is already in JSON format
      console.log('Fetched Clients Data:', results); // Debugging step
      res.json(results);
    });
  };
  

// Fetch a single client by ID
exports.fetchClientById = (req, res) => {
  const clientId = req.params.id;
  const query = `
    SELECT 
      Clients.Client_ID, 
      Clients.F_name, 
      Clients.L_name, 
      Clients.Email, 
      Clients.Phone_No,
      JSON_ARRAYAGG(JSON_OBJECT('Job_ID', Jobs.Job_ID, 'Job_Type', Jobs.Job_Type)) AS jobs
    FROM 
      Clients
    LEFT JOIN 
      Jobs ON Clients.Client_ID = Jobs.Client_ID
    WHERE 
      Clients.Client_ID = ?
    GROUP BY 
      Clients.Client_ID;
  `;

  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error(`Error fetching client ${clientId}:`, err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Parse jobs or return an empty array
   // Parse jobs or return an empty array
const client = results[0] || null;
if (client) {
  // Parse jobs only if it's a string, otherwise use as-is or default to []
  client.jobs = typeof client.jobs === "string" ? JSON.parse(client.jobs) : client.jobs || [];
}


    res.json(client || {});
  });
};

exports.addClient = (req, res) => {
    const { F_name, L_name, Email, Phone_No } = req.body;
  
    const query = `
      INSERT INTO Clients (F_name, L_name, Email, Phone_No) 
      VALUES (?, ?, ?, ?);
    `;
  
    db.query(query, [F_name, L_name, Email, Phone_No], (err, result) => {
      if (err) {
        console.error("Error adding client:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
  
      res.status(201).json({ message: "Client added successfully", Client_ID: result.insertId });
    });
  };
  

  exports.updateClientById = (req, res) => {
    const clientId = req.params.id;
    const { F_name, L_name, Email, Phone_No } = req.body;
  
    const query = `
      UPDATE Clients
      SET F_name = ?, L_name = ?, Email = ?, Phone_No = ?
      WHERE Client_ID = ?;
    `;
  
    db.query(query, [F_name, L_name, Email, Phone_No, clientId], (err) => {
      if (err) {
        console.error("Error updating client:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
  
      res.json({ message: "Client updated successfully" });
    });
  };
  exports.deleteClientById = (req, res) => {
    const clientId = req.params.id;
  
    const query = `
      DELETE FROM Clients
      WHERE Client_ID = ?;
    `;
  
    db.query(query, [clientId], (err) => {
      if (err) {
        console.error("Error deleting client:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
  
      res.json({ message: "Client deleted successfully" });
    });
  };
  
  
  
exports.getJobsByClientId = (req, res) => {
  const clientId = req.params.clientId;
  const query = `
    SELECT Job_ID, Job_Type
    FROM Jobs
    WHERE Client_ID = ?;
  `;

  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
};
