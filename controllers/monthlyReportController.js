const MonthlyReport = require('../models/monthlyReportModel');

// Create a monthly report
const createMonthlyReport = async (req, res) => {
  try {
    const { employee, month, year, overtimeHours, leaveCount, jobRole, workingHours, overallEffectiveness } = req.body;
    const monthlyReport = new MonthlyReport({
      employee,
      month,
      year,
      overtimeHours,
      leaveCount,
      jobRole,
      workingHours,
      overallEffectiveness
    });

    await monthlyReport.save();
    res.status(201).json(monthlyReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all monthly reports
const getAllMonthlyReports = async (req, res) => {
  try {
    const monthlyReports = await MonthlyReport.find();
    res.json(monthlyReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific monthly report by ID
const getMonthlyReportById = async (req, res) => {
  res.json(res.monthlyReport);
};

// Update a monthly report
const updateMonthlyReport = async (req, res) => {
  try {
    const { employee, month, year, overtimeHours, leaveCount, jobRole, workingHours, overallEffectiveness } = req.body;
    res.monthlyReport.employee = employee;
    res.monthlyReport.month = month;
    res.monthlyReport.year = year;
    res.monthlyReport.overtimeHours = overtimeHours;
    res.monthlyReport.leaveCount = leaveCount;
    res.monthlyReport.jobRole = jobRole;
    res.monthlyReport.workingHours = workingHours;
    res.monthlyReport.overallEffectiveness = overallEffectiveness;

    await res.monthlyReport.save();
    res.json(res.monthlyReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a monthly report
const deleteMonthlyReport = async (req, res) => {
  try {
    await res.monthlyReport.remove();
    res.json({ message: 'Monthly report deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMonthlyReport,
  getAllMonthlyReports,
  getMonthlyReportById,
  updateMonthlyReport,
  deleteMonthlyReport
};
