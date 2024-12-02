const express = require('express');
const {
  fetchPaginatedJobs,
  addNewJob,
  updateJobById,
  deleteJobByIdController,
} = require('../controllers/jobs-controller');

const router = express.Router();

router.get('/jobs', fetchPaginatedJobs);
router.post('/jobs', addNewJob);
router.put('/jobs/:id', updateJobById);
router.delete('/jobs/:id', deleteJobByIdController);

module.exports = router;
