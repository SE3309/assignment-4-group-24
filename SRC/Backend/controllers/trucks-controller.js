const db = require('../db');

// Fetch all trucks
exports.getAllTrucks = (req, res) => {
  const query = `
    SELECT Truck_ID, License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date 
    FROM Trucks
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).send(err);
    }
    console.log('Fetched trucks:', results);  // Logs the result for debugging
    res.json(results);
  });
};

// Fetch truck details by ID
exports.getTruckDetails = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT * FROM Trucks WHERE Truck_ID = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results[0]);
  });
};

// Add a new truck
exports.addTruck = (req, res) => {
  const { License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID } = req.body;
  const query = `
    INSERT INTO Trucks (License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: 'Truck added successfully!' });
  });
};

// Update truck information
exports.updateTruck = (req, res) => {
  const { id } = req.params;
  const { License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID } = req.body;

  const query = `
    UPDATE Trucks
    SET License_Plate = ?, Truck_Brand = ?, Max_Capacity = ?, Total_Driven = ?, Availability = ?, Last_Service_Date = ?, Dispatcher_ID = ?
    WHERE Truck_ID = ?
  `;
  
  db.query(query, [License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: `Truck ${id} updated successfully!` });
  });
};

// Delete a truck
exports.deleteTruck = (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM Trucks WHERE Truck_ID = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: `Truck ${id} deleted successfully!` });
  });
};
