import React from 'react';
import './MonthlyReport.css';

const MonthlyReport = () => {
  const report = {
    month: 'June',
    year: 2023,
    employeeName: 'John Doe',
    employeeEmail: 'johndoe@example.com',
    employeePhone: '123-456-7890',
    jobRole: 'Software Developer',
    workingHours: 160,
    overtimeHours: 10,
    leaveCount: 2,
    overallEffectiveness: 'Excellent',
  };

  return (
    <div className="monthly-report-container">
      <h1 className="report-heading">Monthly Report</h1>
      <div className="year-month-container">
        <div className="year-box">
          <h3 className="year-label">Year</h3>
          <p className="year-value">{report.year}</p>
        </div>
        <div className="month-box">
          <h3 className="month-label">Month</h3>
          <p className="month-value">{report.month}</p>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-details">
          <h3 className="profile-label">Employee</h3>
          <p className="profile-info">{report.employeeName}</p>
          <h3 className="profile-label">Email</h3>
          <p className="profile-info">{report.employeeEmail}</p>
          <h3 className="profile-label">Phone No</h3>
          <p className="profile-info">{report.employeePhone}</p>
          <h3 className="profile-label">Job Role</h3>
          <p className="profile-info">{report.jobRole}</p>
        </div>
        <div className="other-details">
          <div className="info-box">
            <h3 className="info-label">Working Hours</h3>
            <p className="info-value">{report.workingHours}</p>
          </div>
          <div className="info-box">
            <h3 className="info-label">OT Hours</h3>
            <p className="info-value">{report.overtimeHours}</p>
          </div>
          <div className="info-box">
            <h3 className="info-label">Leave Count</h3>
            <p className="info-value">{report.leaveCount}</p>
          </div>
          <div className="info-box">
            <h3 className="info-label">Overall Effectiveness</h3>
            <p className="info-value">{report.overallEffectiveness}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
