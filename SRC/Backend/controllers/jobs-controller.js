const db = require('../db');

// Add a job
exports.addJob = (req, res) => {
  const {
    Start_Date, Number_Of_Trucks, Job_Type, Client_ID, Dispatcher_ID, p_address, p_city, p_state_province,
    p_country, p_zip_code, p_unit_number, d_address, d_city, d_state_province, d_country, d_zip_code,
    d_unit_number, job_status, End_Date
  } = req.body;

  // Validation for required fields
  if (!Start_Date || !Number_Of_Trucks || !Job_Type || !Client_ID || !Dispatcher_ID) {
    return res.status(400).json({ error: "Start_Date, Number_Of_Trucks, Job_Type, Client_ID, and Dispatcher_ID are required." });
  }

  const query = `
    INSERT INTO Jobs (
      Start_Date, Number_Of_Trucks, Job_Type, Client_ID, Dispatcher_ID, p_address, p_city, p_state_province, 
      p_country, p_zip_code, p_unit_number, d_address, d_city, d_state_province, d_country, d_zip_code, 
      d_unit_number, job_status, End_Date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    Start_Date, Number_Of_Trucks, Job_Type, Client_ID, Dispatcher_ID, p_address, p_city, p_state_province,
    p_country, p_zip_code, p_unit_number, d_address, d_city, d_state_province, d_country, d_zip_code,
    d_unit_number, job_status, End_Date
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Job added successfully!', jobId: results.insertId });
  });
};

// Edit a job
exports.updateJob = (req, res) => {
  const { id } = req.params;
  const {
    Start_Date, Number_Of_Trucks, Job_Type, Client_ID, Dispatcher_ID, p_address, p_city, p_state_province,
    p_country, p_zip_code, p_unit_number, d_address, d_city, d_state_province, d_country, d_zip_code,
    d_unit_number, job_status, End_Date
  } = req.body;

  let updates = [];
  let values = [];
  const fields = {
    Start_Date, Number_Of_Trucks, Job_Type, Client_ID, Dispatcher_ID, p_address, p_city, p_state_province,
    p_country, p_zip_code, p_unit_number, d_address, d_city, d_state_province, d_country, d_zip_code,
    d_unit_number, job_status, End_Date
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update." });
  }

  const query = `UPDATE Jobs SET ${updates.join(", ")} WHERE Job_ID = ?`;
  values.push(id);

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: `Job ${id} updated successfully.` });
  });
};

// Delete a job
exports.deleteJob = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Jobs WHERE Job_ID = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: `Job ${id} deleted successfully.` });
  });
};

// Get all jobs
exports.getAllJobs = (req, res) => {
  const query = `SELECT * FROM Jobs`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
