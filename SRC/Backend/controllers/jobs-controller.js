const {
  getPaginatedJobs,
  addJob,
  updateJob,
  deleteJobById,
} = require('../models/jobs');

const fetchPaginatedJobs = (req, res) => {
  const limit = parseInt(req.query.limit) || 25;
  const offset = parseInt(req.query.offset) || 0;
  const primarySortKey = req.query.primarySortKey || 'Start_Date';
  const sortOrder = req.query.sortOrder || 'ASC';
  const filters = {
    clientName: req.query.search || '',
  };

  getPaginatedJobs(limit, offset, primarySortKey, sortOrder, filters, (err, results) => {
    if (err) {
      console.error('Error fetching paginated jobs:', err);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
    res.status(200).json(results);
  });
};

const addNewJob = (req, res) => {
  const job = req.body;
  addJob(job, (err, result) => {
    if (err) {
      console.error('Error adding job:', err);
      return res.status(500).json({ error: 'Failed to add job' });
    }
    res.status(201).json({ message: 'Job added successfully', jobId: result.insertId });
  });
};

const updateJobById = (req, res) => {
  const jobId = req.params.id;
  const jobData = req.body;
  updateJob(jobId, jobData, (err, result) => {
    if (err) {
      console.error('Error updating job:', err);
      return res.status(500).json({ error: 'Failed to update job' });
    }
    res.status(200).json({ message: 'Job updated successfully' });
  });
};

const deleteJobByIdController = (req, res) => {
  const jobId = req.params.id;
  deleteJobById(jobId, (err, result) => {
    if (err) {
      console.error('Error deleting job:', err);
      return res.status(500).json({ error: 'Failed to delete job' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  });
};


const fetchJobById = (req, res) => {
  const jobId = req.params.id;
  getJobById(jobId, (err, result) => {
    if (err) {
      console.error('Error fetching job by ID:', err);
      return res.status(500).json({ error: 'Failed to fetch job' });
    }
    res.status(200).json(result[0]);
  });
};

module.exports = {
  fetchPaginatedJobs,
  addNewJob,
  updateJobById,
  deleteJobByIdController,
  fetchJobById, // Export this
};
