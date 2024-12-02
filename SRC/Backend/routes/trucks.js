const express = require('express');
const router = express.Router();
const trucksController = require('../controllers/trucks-controller');

// Routes
router.get('/', trucksController.getAllTrucks); // Fetch all trucks
router.get('/:id', trucksController.getTruckDetails); // Fetch specific truck details
router.post('/', trucksController.addTruck); // Add a new truck
router.put('/:id', trucksController.updateTruck); // Update a truck's information
router.delete('/:id', trucksController.deleteTruck); // Delete a truck

module.exports = router;
