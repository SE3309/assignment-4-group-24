
const db = require('../db'); 

const { getAvailableTrucksCount } = require('../models/truck');
const { getAvailableDriversCount } = require('../models/driver');

// Get combined dashboard data
const getDashboardData = (callback) => {
  let data = {};
  getAvailableTrucksCount((err, truckResults) => {
    if (err) return callback(err);

    data.availableTrucks = truckResults[0].availableTrucks;

    getAvailableDriversCount((err, driverResults) => {
      if (err) return callback(err);

      data.availableDrivers = driverResults[0].availableDrivers;

      callback(null, data);
    });
  });
};



const getExpenseReportByTruckId = async (req, res) => {

  const truckId = parseInt(req.params.truckId, 10); // Ensure it's converted to an integer
  console.log(req.params.truckId);

   // Validate truckId
   if (isNaN(truckId)) {
    return res.status(400).json({ error: 'Invalid Truck ID' }); // Handle invalid input
}
  try {
      const query = `
          SELECT 
              e.Expense_ID, e.Job_ID, e.Truck_ID, e.Fuel_Cost, e.Toll_Cost, 
              e.Other_Expenses, e.Total_Cost, e.Date, t.License_Plate, t.Truck_Brand
          FROM 
              Expenses e 
          INNER JOIN 
              Trucks t ON e.Truck_ID = t.Truck_ID
          WHERE 
              e.Truck_ID = ?
      `;
      console.log('Executing query:', query);
      console.log('Truck ID:', truckId);
          // Perform the query and get the result
    const [rows] = await db.promise().execute(query, [truckId]); 

    // Access rows correctly (likely `result[0]` or `result[0]._rows`)
    console.log('Rows:', rows);

    // If no rows are found, return a 404 error
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No expenses found for the given Truck ID' });
    }

    // Send the rows as JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error.stack);
    res.status(500).json({ error: 'An error occurred while retrieving the expense report' });
  }
};


module.exports = { getDashboardData, getExpenseReportByTruckId};
