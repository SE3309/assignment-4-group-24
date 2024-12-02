const db = require('../db');

// Get count of available drivers
const getAvailableDriversCount = (callback) => {
  const query = `SELECT COUNT(*) AS availableDrivers FROM Drivers WHERE Availability = 1`;
  db.query(query, [], callback);
};

// Get all drivers
const getAllDrivers = (callback) => {
  const query = 'SELECT * FROM Drivers';
  db.query(query, callback);
};

// Get paginated, sorted, and grouped drivers
const getPaginatedDrivers = (limit, offset, primarySortKey = 'Driver_ID', secondarySortKey = '', sortOrder = 'ASC', search = '', callback) => {
  const validSortKeys = ['Driver_ID', 'F_Name', 'L_Name', 'License_Type', 'Availability'];
  const primaryOrderBy = validSortKeys.includes(primarySortKey) ? primarySortKey : 'Driver_ID';
  const secondaryOrderBy = validSortKeys.includes(secondarySortKey) ? secondarySortKey : null;
  const validSortOrders = ['ASC', 'DESC'];
  const orderDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
  const searchFilter = `%${search}%`;

  let query = `
    SELECT * FROM Drivers
    WHERE F_Name LIKE ? OR L_Name LIKE ? OR License_Type LIKE ?
    ORDER BY ${primaryOrderBy} ${orderDirection}
  `;
  if (secondaryOrderBy) {
    query += `, ${secondaryOrderBy} ${orderDirection}`;
  }
  query += ` LIMIT ? OFFSET ?`;

  db.query(query, [searchFilter, searchFilter, searchFilter, limit, offset], callback);
};

// Add a new driver
const addDriver = (driver, callback) => {
  const query = `
    INSERT INTO Drivers (F_Name, L_Name, License_Type, Availability, Phone_No, Dispatcher_ID)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const { F_Name, L_Name, License_Type, Availability, Phone_No, Dispatcher_ID } = driver;
  db.query(query, [F_Name, L_Name, License_Type, Availability, Phone_No, Dispatcher_ID], callback);
};

// Update driver details
const updateDriver = (driverId, driverData, callback) => {
  const query = `
    UPDATE Drivers
    SET F_Name = ?, L_Name = ?, License_Type = ?, Availability = ?, Phone_No = ?, Dispatcher_ID = ?
    WHERE Driver_ID = ?;
  `;
  const { F_Name, L_Name, License_Type, Availability, Phone_No, Dispatcher_ID } = driverData;
  db.query(
    query,
    [F_Name, L_Name, License_Type, Availability, Phone_No, Dispatcher_ID, driverId],
    callback
  );
};

// Delete driver by ID
const deleteDriverById = (driverId, callback) => {
  const query = `
    DELETE FROM Drivers
    WHERE Driver_ID = ?;
  `;
  db.query(query, [driverId], callback);
};

module.exports = {
  getPaginatedDrivers,
  getAvailableDriversCount,
  getAllDrivers,
  addDriver,
  updateDriver,
  deleteDriverById, // Added delete function
};
