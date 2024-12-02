const express = require('express');
const {
  fetchPaginatedDrivers,
  addNewDriver,
  updateDriverById,
  deleteDriverByIdController, // Import delete controller
} = require('../controllers/drivers-controller');

const router = express.Router();

// Route to get paginated and sorted drivers
router.get('/drivers', fetchPaginatedDrivers);

// Route to add a new driver
router.post('/drivers', addNewDriver);

// Route to update a driver
router.put('/drivers/:id', updateDriverById);

// Route to delete a driver
router.delete('/drivers/:id', deleteDriverByIdController);

module.exports = router;
