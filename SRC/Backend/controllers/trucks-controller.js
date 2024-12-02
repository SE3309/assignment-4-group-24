const db = require('../db');

// Fetch all trucks
exports.getAllTrucks = (req, res) => {
    const query = `
      SELECT Truck_ID, License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date 
      FROM Trucks
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching trucks:', err); // Log errors
        return res.status(500).json({ error: 'Failed to fetch trucks.' });
      }
      res.json(results); // Send the results as JSON
    });
  };

// Fetch truck details by ID
exports.getTruckDetails = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Trucks WHERE Truck_ID = ?`;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).send(err);
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
  
  db.query(query, [License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Truck added successfully!' });
  });
};

exports.updateTruck = (req, res) => {
    const { id } = req.params;
  
    // Fetch current truck details
    const getCurrentTruckQuery = `
      SELECT * FROM Trucks WHERE Truck_ID = ?
    `;
  
    db.query(getCurrentTruckQuery, [id], (fetchErr, results) => {
      if (fetchErr) {
        console.error('Error fetching current truck details:', fetchErr);
        return res.status(500).send({ error: 'Error fetching current truck details.' });
      }
  
      if (results.length === 0) {
        return res.status(404).send({ error: `Truck with ID ${id} not found.` });
      }
  
      const currentTruck = results[0];
  
      // Use existing values if new ones are not provided
      const {
        License_Plate = currentTruck.License_Plate,
        Truck_Brand = currentTruck.Truck_Brand,
        Max_Capacity = currentTruck.Max_Capacity,
        Total_Driven = currentTruck.Total_Driven,
        Availability = currentTruck.Availability,
        Last_Service_Date = currentTruck.Last_Service_Date,
        Dispatcher_ID = currentTruck.Dispatcher_ID,
      } = req.body;
  
      const updateTruckQuery = `
        UPDATE Trucks
        SET License_Plate = ?, Truck_Brand = ?, Max_Capacity = ?, Total_Driven = ?, Availability = ?, Last_Service_Date = ?, Dispatcher_ID = ?
        WHERE Truck_ID = ?
      `;
  
      db.query(
        updateTruckQuery,
        [License_Plate, Truck_Brand, Max_Capacity, Total_Driven, Availability, Last_Service_Date, Dispatcher_ID, id],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating truck:', updateErr);
            return res.status(500).send({ error: 'Error updating truck.' });
          }
  
          res.json({ message: `Truck ${id} updated successfully.` });
        }
      );
    });
  };
  
  
  

// Delete a truck
exports.deleteTruck = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Trucks WHERE Truck_ID = ?`;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error deleting truck:', err); // Logs any SQL or server-side errors
        return res.status(500).json({ error: 'Failed to delete truck.' });
      }
  
      // Check if a row was actually deleted
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Truck not found.' });
      }
  
      res.json({ message: `Truck ${id} deleted successfully!` });
    });
  };

  exports.getTruckWithMostJobs = (req, res) => {
    const { month, year } = req.query;
  
    console.log('Received request for most jobs: ', { month, year }); // Add this log
  
    if (!month || !year) {
      console.error('Missing month or year in query parameters');
      return res.status(400).json({ error: 'Month and year are required.' });
    }
  
    const query = `
      SELECT 
          t.Truck_ID,
          t.License_Plate,
          t.Truck_Brand,
          COUNT(jd.Job_ID) AS Total_Jobs
      FROM 
          JobDetails jd
      INNER JOIN 
          Trucks t ON jd.Truck_ID = t.Truck_ID
      INNER JOIN 
          Jobs j ON jd.Job_ID = j.Job_ID
      WHERE 
          MONTH(j.Start_Date) = ? AND YEAR(j.Start_Date) = ?
      GROUP BY 
          t.Truck_ID
      ORDER BY 
          Total_Jobs DESC
      LIMIT 1;
    `;
  
    db.query(query, [month, year], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed.' });
      }
  
      console.log('Query results:', results); // Add this log
  
      if (results.length === 0) {
        console.log('No jobs found for the specified month and year.');
        return res.status(404).json({ message: 'No jobs found for the specified month and year.' });
      }
  
      res.json(results[0]);
    });
  };
  