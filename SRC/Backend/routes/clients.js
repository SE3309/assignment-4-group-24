const express = require('express');
// Import the controller functions using destructuring
const {
  fetchAllClients,
  fetchClientById,
  addClient,
  updateClientById,
  deleteClientById,
  getJobsByClientId, // Add the missing import for getJobsByClientId
} = require('../controllers/clients-controller');

const router = express.Router();

// Define routes with the imported functions
router.get('/', fetchAllClients);
router.get('/:id', fetchClientById);
router.get('/:clientId/jobs', getJobsByClientId); // Correct route for jobs by client ID
router.post('/', addClient);
router.put('/:id', updateClientById);
router.delete('/:id', deleteClientById);

module.exports = router;
