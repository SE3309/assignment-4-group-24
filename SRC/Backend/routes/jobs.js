const express = require('express');
const {
  fetchPaginatedJobs,
  addNewJob,
  updateJobById,
  deleteJobByIdController,
  fetchJobById,
} = require('../controllers/jobs-controller');

const router = express.Router();

router.get('/', fetchPaginatedJobs);
router.post('/', addNewJob);
router.put('/:id', updateJobById);
router.delete('/:id', deleteJobByIdController);
router.get('/:id', fetchJobById); // Add this


module.exports = router;
