const db = require('../db');

// Get all jobs with pagination, filtering, and sorting
const getPaginatedJobs = (limit, offset, primarySortKey, sortOrder, filters, callback) => {
  const { clientName, jobStatus, startDate, endDate } = filters;

  let query = `
    SELECT Jobs.Job_ID, Jobs.Client_ID, Clients.F_name AS ClientName, Jobs.Number_Of_Trucks, Jobs.Start_Date, Jobs.End_Date, Jobs.job_status
    FROM Jobs
    INNER JOIN Clients ON Jobs.Client_ID = Clients.Client_ID
    WHERE 1=1
  `;

  const queryParams = [];

  if (clientName) {
    query += ' AND Clients.F_name = ?';
    queryParams.push(clientName);
  }

  if (jobStatus !== undefined) {
    query += ' AND Jobs.job_status = ?';
    queryParams.push(jobStatus);
  }

  if (startDate) {
    query += ' AND Jobs.Start_Date >= ?';
    queryParams.push(startDate);
  }

  if (endDate) {
    query += ' AND Jobs.End_Date <= ?';
    queryParams.push(endDate);
  }

  query += ` ORDER BY ${primarySortKey} ${sortOrder} LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  db.query(query, queryParams, callback);
};

// Add a new job
const addJob = (job, callback) => {
  const query = `
    INSERT INTO Jobs (Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status)
    VALUES (?, ?, ?, ?, ?)
  `;
  const { Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status } = job;
  db.query(query, [Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status], callback);
};

// Update job details
const updateJob = (jobId, jobData, callback) => {
  const query = `
    UPDATE Jobs
    SET Client_ID = ?, Number_Of_Trucks = ?, Start_Date = ?, End_Date = ?, job_status = ?
    WHERE Job_ID = ?
  `;
  const { Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status } = jobData;
  db.query(query, [Client_ID, Number_Of_Trucks, Start_Date, End_Date, job_status, jobId], callback);
};

// Delete a job by ID
const deleteJobById = (jobId, callback) => {
  const query = `
    DELETE FROM Jobs
    WHERE Job_ID = ?
  `;
  db.query(query, [jobId], callback);
};

module.exports = {
  getPaginatedJobs,
  addJob,
  updateJob,
  deleteJobById,
};
