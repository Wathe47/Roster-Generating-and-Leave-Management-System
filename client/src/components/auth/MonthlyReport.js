import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./MonthlyReport.css";

const MonthlyReport = () => {
  const report = {
    month: "June",
    year: 2023,
    employeeName: "John Doe",
    employeeEmail: "johndoe@example.com",
    employeePhone: "123-456-7890",
    jobRole: "Software Developer",
    workingHours: 160,
    overtimeHours: 10,
    leaveCount: 2,
    overallEffectiveness: "Excellent",
  };

  const data = [
    { name: "Working Hours", value: report.workingHours },
    { name: "Overtime Hours", value: report.overtimeHours },
    { name: "Leave Count", value: report.leaveCount },
  ];

  return (
    <div className="back">
      <div className="monthly-report-container">
        <h1 className="report-heading">Monthly Report</h1>

        <div className="card-container">
          <div className="card">
            <h2 className="card-heading">Date</h2>
            <p className="card-content-bold">
              {report.month} {report.year}
            </p>
          </div>

          <div className="card">
            <h2 className="card-heading">Employee Information</h2>
            <p className="card-content">
              <strong>Name:</strong> {report.employeeName}
            </p>
            <p className="card-content">
              <strong>Email:</strong> {report.employeeEmail}
            </p>
            <p className="card-content">
              <strong>Phone No:</strong> {report.employeePhone}
            </p>
            <p className="card-content">
              <strong>Job Role:</strong> {report.jobRole}
            </p>
          </div>

          <div className="card">
            <h2 className="card-heading">Work Hours</h2>
            <p className="card-content">
              <strong>Working Hours:</strong> {report.workingHours}
            </p>
            <p className="card-content">
              <strong>Overtime Hours:</strong> {report.overtimeHours}
            </p>
            <p className="card-content">
              <strong>Leave Count:</strong> {report.leaveCount}
            </p>
          </div>
        </div>

        <div className="card chart-card">
          <h2 className="card-heading">Work Distribution</h2>
          <div className="chart-container">
            <BarChart width={600} height={200} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Hours" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;