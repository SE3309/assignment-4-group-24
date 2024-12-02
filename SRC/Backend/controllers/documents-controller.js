const db = require('../db');

exports.addDocument = (req, res) => {
    const { type, documentType, filePath, jobId, dispatcherId, driverId, truckId } = req.body;
    const table = `${type}Documents`;
  
    // Validation for required fields
    if (!documentType || !filePath || !dispatcherId) {
      return res.status(400).json({ error: "Document_Type, File_Path, and Dispatcher_ID are required." });
    }
  
    // Create query dynamically based on type
    let query = `INSERT INTO ${table} (Document_Type, File_Path, Dispatcher_ID`;
    let values = [documentType, filePath, dispatcherId];
    if (type === 'Client') {
      query += `, Job_ID`;
      values.push(jobId);
    } else if (type === 'Driver') {
      query += `, Driver_ID`;
      values.push(driverId);
    } else if (type === 'Truck') {
      query += `, Truck_ID`;
      values.push(truckId);
    }
    query += `) VALUES (?, ?, ?${type === 'Client' || type === 'Driver' || type === 'Truck' ? ', ?' : ''})`;
  
    db.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Document added to ${type}` });
    });
  };
  

// Edit a document
exports.updateDocument = (req, res) => {
    const { type, id } = req.params;
    const { documentType, filePath, jobId, dispatcherId, driverId, truckId } = req.body;
    const table = `${type}Documents`;
  
    // Dynamic query construction
    let updates = [];
    let values = [];
    if (documentType) {
      updates.push(`Document_Type = ?`);
      values.push(documentType);
    }
    if (filePath) {
      updates.push(`File_Path = ?`);
      values.push(filePath);
    }
    if (dispatcherId) {
      updates.push(`Dispatcher_ID = ?`);
      values.push(dispatcherId);
    }
    if (type === 'Client' && jobId) {
      updates.push(`Job_ID = ?`);
      values.push(jobId);
    } else if (type === 'Driver' && driverId) {
      updates.push(`Driver_ID = ?`);
      values.push(driverId);
    } else if (type === 'Truck' && truckId) {
      updates.push(`Truck_ID = ?`);
      values.push(truckId);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }
  
    const query = `UPDATE ${table} SET ${updates.join(", ")} WHERE Document_ID = ?`;
    values.push(id);
  
    db.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Document ${id} updated in ${type}` });
    });
  };
  // Delete a document
exports.deleteDocument = (req, res) => {
  const { type, id } = req.params;
  const table = `${type}Documents`;
  const query = `DELETE FROM ${table} WHERE Document_ID = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: `Document ${id} deleted from ${type}` });
  });
};

exports.getAllDocuments = (req, res) => {
    const { type } = req.query;
  
    // Base query for all types
    let query = `
      SELECT 'Client' AS Type, Document_ID, Document_Type, Created_At, File_Path FROM ClientDocuments
      UNION
      SELECT 'Driver' AS Type, Document_ID, Document_Type, Created_At, File_Path FROM DriverDocuments
      UNION
      SELECT 'Truck' AS Type, Document_ID, Document_Type, Created_At, File_Path FROM TruckDocuments
    `;
  
    // Filter by type if specified
    if (type?.toLowerCase() === 'client') {
      query = `SELECT 'Client' AS Type, Document_ID, Document_Type, Created_At, File_Path FROM ClientDocuments`;
    } else if (type?.toLowerCase() === 'driver') {
      query = `SELECT 'Driver' AS Type, Document_ID, Document_Type, Created_At, File_Path FROM DriverDocuments`;
    } else if (type?.toLowerCase() === 'truck') {
      query = `SELECT 'Truck' AS Type, Document_ID, Document_Type, Created_At, File_Path FROM TruckDocuments`;
    }
    console.log('Executing Query:', query);

    db.query(query, (err, results) => {
      if (err) {
        console.error('SQL Error:', err);
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
  };
  