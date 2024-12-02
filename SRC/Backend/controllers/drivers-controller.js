const db = require('../db'); // Add this line
const { 
  getPaginatedDrivers, 
  getAvailableDriversCount, 
  getAllDrivers, 
  addDriver, 
  updateDriver, 
  deleteDriverById 
} = require('../models/driver');

// Controller to fetch paginated, sorted, and filtered drivers
const fetchPaginatedDrivers = (req, res) => {
  const limit = parseInt(req.query.limit) || 25; // Default limit
  const offset = parseInt(req.query.offset) || 0; // Default offset
  const primarySortKey = req.query.primarySortKey || 'Driver_ID'; // Default primary sorting column
  const secondarySortKey = req.query.secondarySortKey || ''; // Default: no secondary sorting
  const sortOrder = req.query.sortOrder || 'ASC'; // Default sorting order
  const search = req.query.search || ''; // Default: no search term

  getPaginatedDrivers(limit, offset, primarySortKey, secondarySortKey, sortOrder, search, (err, results) => {
    if (err) {
      console.error('Error fetching paginated drivers:', err);
      return res.status(500).json({ error: 'Failed to fetch drivers' });
    }
    res.status(200).json(results);
  });
};

// Controller to fetch count of available drivers
const fetchAvailableDriversCount = (req, res) => {
  getAvailableDriversCount((err, results) => {
    if (err) {
      console.error('Error fetching available drivers count:', err);
      return res.status(500).json({ error: 'Failed to fetch available drivers count' });
    }
    res.status(200).json(results);
  });
};

// Controller to fetch all drivers
const fetchAllDrivers = (req, res) => {
  getAllDrivers((err, results) => {
    if (err) {
      console.error('Error fetching all drivers:', err);
      return res.status(500).json({ error: 'Failed to fetch all drivers' });
    }
    res.status(200).json(results);
  });
};

// Controller to add a new driver
const addNewDriver = (req, res) => {
  const driver = req.body;

  // Validate input
  if (
    !driver.F_Name ||
    !driver.L_Name ||
    !driver.License_Type ||
    driver.Availability === undefined ||
    !driver.Phone_No ||
    !driver.Dispatcher_ID
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  addDriver(driver, (err, result) => {
    if (err) {
      console.error('Error adding driver:', err);
      return res.status(500).json({ error: 'Failed to add driver' });
    }
    res.status(201).json({ message: 'Driver added successfully', driverId: result.insertId });
  });
};

// Controller to update driver details
const updateDriverById = (req, res) => {
  const driverId = parseInt(req.params.id, 10); // Ensure ID is a number
  if (isNaN(driverId)) {
    return res.status(400).json({ error: 'Invalid Driver_ID' });
  }

  const driverData = req.body;

  const validFields = ['F_Name', 'L_Name', 'License_Type', 'Availability', 'Phone_No'];
  const updates = [];
  const values = [];

  validFields.forEach(field => {
    if (driverData[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(driverData[field]);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  values.push(driverId); // Add Driver_ID to query parameters

  const query = `
    UPDATE Drivers
    SET ${updates.join(', ')}
    WHERE Driver_ID = ?;
  `;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating driver:', err.message);
      return res.status(500).json({ error: 'Failed to update driver', debug: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver updated successfully' });
  });
};



// Controller to delete a driver by ID
const deleteDriverByIdController = (req, res) => {
  const { id } = req.params;

  deleteDriverById(id, (err, result) => {
    if (err) {
      console.error('Error deleting driver:', err);
      return res.status(500).json({ error: 'Failed to delete driver' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  });
};

module.exports = {
  fetchPaginatedDrivers,
  fetchAvailableDriversCount,
  fetchAllDrivers,
  addNewDriver,
  updateDriverById,
  deleteDriverByIdController, // Added delete controller
};
