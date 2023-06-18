const express = require('express');
const router = express.Router();
const monthlyReportController = require('../controllers/monthlyReportController');

// Create a monthly report
router.post('/', monthlyReportController.createMonthlyReport);

// Get all monthly reports
router.get('/', monthlyReportController.getAllMonthlyReports);

// Get a specific monthly report by ID
router.get('/:id', monthlyReportController.getMonthlyReportById);

// Update a monthly report
router.patch('/:id', monthlyReportController.updateMonthlyReport);

// Delete a monthly report
router.delete('/:id', monthlyReportController.deleteMonthlyReport);

module.exports = router;
