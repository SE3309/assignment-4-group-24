const express = require('express');

const { getDashboardData, getExpenseReportByTruckId } = require('../controllers/dashboard-controller');

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

module.exports = router;
