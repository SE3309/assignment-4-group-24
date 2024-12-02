const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs-controller');

// Routes
router.get('/', jobsController.getAllJobs);
router.post('/', jobsController.addJob);
router.put('/:id', jobsController.updateJob);
router.delete('/:id', jobsController.deleteJob);

module.exports = router;
