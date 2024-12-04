const db = require('../db');

const getPaginatedJobs = (limit, offset, primarySortKey, sortOrder, filters, callback) => {
  const query = `
    SELECT 
      j.Job_ID, 
      CONCAT(c.F_name, ' ', c.L_name) AS ClientName, 
      j.Number_Of_Trucks, 
      j.Start_Date, 
      j.End_Date, 
      j.job_status 
    FROM 
      Jobs j 
    INNER JOIN 
      Clients c ON j.Client_ID = c.Client_ID
    WHERE 
      CONCAT(c.F_name, ' ', c.L_name) LIKE ?
    ORDER BY 
      ${primarySortKey} ${sortOrder} 
    LIMIT ? OFFSET ?
  `;

  const queryParams = [`%${filters.clientName}%`, limit, offset];
  db.query(query, queryParams, callback);
};

const addJob = (job, callback) => {
  const query = `
    INSERT INTO Jobs (
      Client_ID, 
      Dispatcher_ID, 
      Job_Type, 
      Number_Of_Trucks, 
      Start_Date, 
      End_Date, 
      job_status, 
      p_address, 
      p_city, 
      p_state_province, 
      p_country, 
      p_zip_code, 
      d_address, 
      d_city, 
      d_state_province, 
      d_country, 
      d_zip_code, 
      d_unit_number
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const {
    Client_ID,
    Dispatcher_ID,
    Job_Type,
    Number_Of_Trucks,
    Start_Date,
    End_Date,
    job_status,
    p_address,
    p_city,
    p_state_province,
    p_country,
    p_zip_code,
    d_address,
    d_city,
    d_state_province,
    d_country,
    d_zip_code,
    d_unit_number,
  } = job;

  db.query(
    query,
    [
      Client_ID,
      Dispatcher_ID,
      Job_Type,
      Number_Of_Trucks,
      Start_Date,
      End_Date,
      job_status,
      p_address,
      p_city,
      p_state_province,
      p_country,
      p_zip_code,
      d_address,
      d_city,
      d_state_province,
      d_country,
      d_zip_code,
      d_unit_number,
    ],
    callback
  );
};


const updateJob = (jobId, jobData, callback) => {
  const query = `
    UPDATE Jobs 
    SET Client_ID = ?, Number_Of_Trucks = ?, Start_Date = ?, End_Date = ?, job_status = ? 
    WHERE Job_ID = ?
  `;
  const { Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status } = jobData;
  db.query(query, [Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status, jobId], callback);
};

const deleteJobById = (jobId, callback) => {
  const query = 'DELETE FROM Jobs WHERE Job_ID = ?';
  db.query(query, [jobId], callback);
};

const getJobById = (jobId, callback) => {
  const query = 'SELECT * FROM Jobs WHERE Job_ID = ?';
  db.query(query, [jobId], callback);
};

module.exports = {
  getPaginatedJobs,
  addJob,
  updateJob,
  deleteJobById,
  getJobById,
};
