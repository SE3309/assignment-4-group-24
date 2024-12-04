const express = require('express');
const { getDashboardData } = require('../controllers/dashboard-controller');

const router = express.Router();

// API to fetch dashboard data
router.get('/data', (req, res) => {
  getDashboardData((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching dashboard data' });
    }
    res.json(results);
  });
});

router.get('/expenses/:truckId', getExpenseReportByTruckId);

router.get('/test-db', async (req, res) => {
  try {
      const [result] = await db.execute('SELECT 1'); // Simple query
      console.log('Database connection successful:', result);
      res.status(200).json({ message: 'Database connection successful', result });
  } catch (error) {
      console.error('Database connection error:', error.message);
      res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});


module.exports = router;
