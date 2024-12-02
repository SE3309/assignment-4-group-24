const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents-controller');

// Routes
router.get('/', documentsController.getAllDocuments);
router.post('/', documentsController.addDocument);
router.put('/:type/:id', documentsController.updateDocument);
router.delete('/:type/:id', documentsController.deleteDocument);

module.exports = router;
