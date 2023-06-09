const AppError = require("../utils/appError");
const User = require("../models/userModel");
const LeaveRequest = require("../models/leaveModel");

const catchAsync = require("../utils/catchAsync");
const { google } = require("googleapis");

const calendar = google.calendar("v3");

const apiKey = process.env.GOOGLE_API_KEY;
const calendarId = "en.lk#holiday@group.v.calendar.google.com";

async function getHolidays(startDate) {
  let holidays = [];
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 5);
  try {
    const response = await calendar.events.list({
      key: apiKey,
      calendarId: calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = response.data.items;
    if (events.length) {
      events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        holidays.push(start);
      });
    } else {
      console.log("No holidays found.");
    }
  } catch (err) {
    console.error(err);
    return new AppError("Error in getting holidays", 500);
  }
  return holidays;
}

async function getWorkingDays(startDate) {
  let workingDays = [];
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const newDate = new Date(date);
    workingDays.push(newDate.toISOString().split("T")[0]);
  }

  const holidays = await getHolidays(startDate);

  workingDays = workingDays.filter((day) => {
    return !holidays.includes(day);
  });

  return workingDays;
}

async function filterDayOffEmp(dateString) {
  const empList = [];

  const leaves = await LeaveRequest.find({
    date: { $nin: dateString },
  });

  if (!leaves) {
    return empList;
  }

  leaves.forEach((leave) => {
    empList.push(leave.employee);
  });

  return empList;
}

async function filterPregnantEmp(empList) {
  const remoteEmp = [];
  const employees = await User.find({ isPregnant: true });

  if (!employees) {
    return empList, remoteEmp;
  }

  employees.forEach((employee) => {
    empList = empList.map((emp) => {
      if (emp === employee._id.toString()) {
        remoteEmp.push(emp);
      }
    });
  });

  employees.forEach((employee) => {
    empList = empList.filter((emp) => emp !== employee._id.toString());
  });

  return empList, remoteEmp;
}

async function assignEmployees(date) {
  //GET AVAILABLE EMPLOYEES FOR GIVEN DATE
  const avlEmpList01 = await filterDayOffEmp(date);

  //FILTER PREGNANT EMPLOYEES OR EMPLOYEES WHO HAVE A CHILD UNDER 5 YEARS
  const { avlEmpList02, remoteEmp } = await filterPregnantEmp(avlEmpList01);
}

exports.getWorkingDays = catchAsync(async (req, res, next) => {
  const startDate = new Date("2023-05-01");

  const holidays = await getWorkingDays(startDate);

  res.status(200).json({
    status: "success",
    data: {
      holidays,
    },
  });
});

exports.testingFunctions = catchAsync(async (req, res, next) => {
  await filterPregnantEmp();
  res.status(200).json({
    status: "success",
  });
});

async function getAvailableEmp(dateString) {
  const date = new Date(dateString);

  const jobTitle = [
    "SoftwareEngineer",
    "QualityAssuranceEngineer",
    "ProjectManager",
    "TechnicalWriter",
  ];

  let eligibleList = {
    date: date,
    eligibleEmployees: {},
  };

  jobTitle.forEach((title) => {
    eligibleList.eligibleEmployees[title] = [];
  });

  const leaves = await LeaveRequest.find({
    date: { $nin: date },
  });

  if (!leaves) {
    return next(new AppError("No leaves found with that ID", 404));
  }

  await Promise.all(
    leaves.map(async (leave) => {
      const eligibleEmp = await User.findById(leave.employee);

      if (eligibleEmp) {
        const role = eligibleEmp.jobTitle.split(" ").join("");

        eligibleList.eligibleEmployees[role].push(eligibleEmp._id.toString());
      }
    })
  );

  return eligibleList;
}
