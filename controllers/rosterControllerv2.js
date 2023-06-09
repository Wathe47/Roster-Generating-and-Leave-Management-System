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

async function getAllDaysInWeek(startDate) {
  const start = new Date(startDate);
  const end = new Date(startDate);
  end.setDate(start.getDate() + 4);

  const allDays = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(start.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return allDays;
}

// =========== ALGORITHM_FUNCTIONS ===========

async function filterDayOffEmp(dateString) {
  const employees = await User.find({ active: true }).lean();
  const empList = employees.map((employee) => employee._id.toString());

  console.log(`Total Employees: ${empList.length}`);

  const leaves = await LeaveRequest.find({
    date: { $in: dateString },
  }).lean();

  console.log(`Total Leaves: ${leaves.length} on ${dateString}`);

  if (!leaves) {
    return empList;
  }

  leaves.forEach((leave) => {
    if (empList.includes(leave.employee.toString())) {
      empList.splice(empList.indexOf(leave.employee.toString()), 1);
    }
  });

  console.log(`Total Available Employees: ${empList.length} on ${dateString}`);

  return empList;
}

async function createListWithRoles(arrayEmpList) {
  const employees = await User.find({ _id: { $in: arrayEmpList } });

  const empList = employees.reduce((acc, emp) => {
    const jobTitle = emp.jobTitle;
    const empId = emp._id.toString();

    if (acc.has(jobTitle)) {
      acc.get(jobTitle).push(empId);
    } else {
      acc.set(jobTitle, [empId]);
    }

    return acc;
  }, new Map());

  return empList;
}

async function filterPregnantEmp(empList) {
  //FILTER PREGNANT EMPLOYEES OR EMPLOYEES WHO HAVE A CHILD UNDER 5 YEARS

  const remoteEmp = [];
  const employees = await User.find({
    $or: [{ isPregnant: true }, { hasChildrenBelow5: true }],
  });

  if (!employees) {
    return [empList, remoteEmp];
  }

  for (let i = 0; i < empList.length; i++) {
    const empId = empList[i];
    employees.forEach((employee) => {
      if (empId === employee._id.toString()) {
        empList.splice(i, 1);
        remoteEmp.push(empId);
        i--;
      }
    });
  }

  return [empList, remoteEmp];
}

async function assignLeadingPerson(empMap) {
  const onSite = [];
  const remote = [];

  const CEO = empMap.get("Chief Executive Officer");
  const COO = empMap.get("Chief Operating Officer");

  if (Boolean(CEO.length) && Boolean(COO.length)) {
    onSite.push(CEO[0]);
    remote.push(COO[0]);
  } else if (Boolean(CEO.length)) {
    onSite.push(CEO[0]);
  } else if (Boolean(COO.length)) {
    onSite.push(COO[0]);
  }

  return [onSite, remote];
}

async function assignAdministrativeEmp(empMap) {
  const onSite = [];
  const remote = [];

  const database = empMap.get("Database Administrator");
  const network = empMap.get("Network Administrator");
  const hr = empMap.get("Human Resources/Administrative");

  const all = [...(database ?? []), ...(network ?? []), ...(hr ?? [])];

  all.sort(() => Math.random() - 0.5);

  if (all.length >= 2) {
    onSite.push(all[0]);
    onSite.push(all[1]);
    for (let i = 2; i < all.length; i++) {
      remote.push(all[i]);
    }
  } else if (all.length === 1) {
    onSite.push(all[0]);
  }

  return [onSite, remote];
}

async function assignEngEmp(empMap) {
  const onSite = [];
  const remote = [];

  const qa = empMap.get("Quality Assurance/Tester");
  const sdev = empMap.get("Senior Software Developer");

  const all = [...(qa ?? []), ...(sdev ?? [])];
  console.log(all);

  all.sort(() => Math.random() - 0.5);

  onSite.push(all[0]);

  if (all.length > 1) {
    for (let i = 1; i < all.length; i++) {
      remote.push(all[i]);
    }
  }

  return [onSite, remote];
}

async function assignSEEmp(empMap) {
  const onSite = [];
  const remote = [];

  const se = empMap.get("Software Developer");

  const all = [...(se ?? [])];

  all.sort(() => Math.random() - 0.5);

  onSite.push(all[0]);
  for (let i = 1; i < all.length; i++) {
    remote.push(all[i]);
  }

  return [onSite, remote];
}

async function assignHelpDeskEmp(empMap) {
  const onSite = [];
  const remote = [];

  const helpDesk = empMap.get("Technical Support/Help Desk");

  const all = [...(helpDesk ?? [])];

  all.sort(() => Math.random() - 0.5);

  onSite.push(all[0]);

  for (let i = 1; i < all.length; i++) {
    remote.push(all[i]);
  }

  return [onSite, remote];
}

async function assignEmployees(date) {
  let onSiteEmp = [];
  let remoteEmp = [];

  //GET AVAILABLE EMPLOYEES FOR GIVEN DATE
  const avlEmpFilter1 = await filterDayOffEmp(date);

  //FILTER PREGNANT EMPLOYEES OR EMPLOYEES WHO HAVE A CHILD UNDER 5 YEARS
  const [avlEmpFilter2, reEmp] = await filterPregnantEmp(avlEmpFilter1);

  remoteEmp = [...remoteEmp, ...reEmp];

  //LIST EMPLOYEES WITH THEIR JOB TITLES
  const EmpMap = await createListWithRoles(avlEmpFilter2);

  //ASSIGN ON-SITE EMPLOYEES.

  // 01) LEADING PERSON  (1 PERSON)
  const [onSiteLead, remoteLead] = await assignLeadingPerson(EmpMap);

  onSiteEmp = [...onSiteEmp, ...onSiteLead];

  if (remoteLead.length) {
    remoteEmp = [...remoteEmp, ...remoteLead];
  }

  // 02) ADMINISTRATION AND MANAGEMENT RELATED (2 PERSONS)
  const [onSiteAdmin, remoteAdmin] = await assignAdministrativeEmp(EmpMap);

  onSiteEmp = [...onSiteEmp, ...onSiteAdmin];

  if (remoteAdmin.length) {
    remoteEmp = [...remoteEmp, ...remoteAdmin];
  }

  // 03) SENIOR SOFTWARE ENGINEERS OR QUALITY ASSURANCE (1 PERSONS)
  const [onSiteEng, remoteEng] = await assignEngEmp(EmpMap);

  onSiteEmp = [...onSiteEmp, ...onSiteEng];

  if (remoteEng.length) {
    remoteEmp = [...remoteEmp, ...remoteEng];
  }

  // 04) SOFTWARE ENGINEERS (1 PERSON)
  const [onSiteSE, remoteSE] = await assignSEEmp(EmpMap);

  onSiteEmp = [...onSiteEmp, ...onSiteSE];

  if (remoteSE.length) {
    remoteEmp = [...remoteEmp, ...remoteSE];
  }

  // 05) HELP DESK (1 PERSON)
  const [onSiteHelpDesk, remoteHelpDesk] = await assignHelpDeskEmp(EmpMap);

  onSiteEmp = [...onSiteEmp, ...onSiteHelpDesk];

  if (remoteHelpDesk.length) {
    remoteEmp = [...remoteEmp, ...remoteHelpDesk];
  }
}

async function generateRooster(startDate) {
  let allDays = await getAllDaysInWeek(startDate);

  let holiDays = await getHolidays(startDate);

  allDays = allDays.map((day) => {
    if (holiDays.includes(day)) {
      return {
        date: day,
        isHoliday: true,
        onSiteEmp: [],
        remoteEmp: [],
      };
    }
    const [onSiteEmp, remoteEmp] = assignEmployees(day);
    return {
      date: day,
      isHoliday: false,
      onSiteEmp,
      remoteEmp,
    };
  });
}

exports.getWorkingDays = catchAsync(async (req, res, next) => {
  const startDate = new Date("2023-06-12");

  const holidays = await getWorkingDays(startDate);

  res.status(200).json({
    status: "success",
    data: {
      holidays,
    },
  });
});

exports.testingFunctions = catchAsync(async (req, res, next) => {
  const result = getAllDaysInWeek("2023-06-12");
  res.status(200).json({
    status: "success",
  });
});

// async function getAvailableEmp(dateString) {
//   const date = new Date(dateString);

//   const jobTitle = [
//     "SoftwareEngineer",
//     "QualityAssuranceEngineer",
//     "ProjectManager",
//     "TechnicalWriter",
//   ];

//   let eligibleList = {
//     date: date,
//     eligibleEmployees: {},
//   };

//   jobTitle.forEach((title) => {
//     eligibleList.eligibleEmployees[title] = [];
//   });

//   const leaves = await LeaveRequest.find({
//     date: { $nin: date },
//   });

//   if (!leaves) {
//     return next(new AppError("No leaves found with that ID", 404));
//   }

//   await Promise.all(
//     leaves.map(async (leave) => {
//       const eligibleEmp = await User.findById(leave.employee);

//       if (eligibleEmp) {
//         const role = eligibleEmp.jobTitle.split(" ").join("");

//         eligibleList.eligibleEmployees[role].push(eligibleEmp._id.toString());
//       }
//     })
//   );

//   return eligibleList;
// }

// async function filterPregnantEmp(empList) {
//   //FILTER PREGNANT EMPLOYEES OR EMPLOYEES WHO HAVE A CHILD UNDER 5 YEARS

//   const remoteEmp = [];
//   const employees = await User.find({
//     $or: [{ isPregnant: true }, { hasChildBelow5: true }],
//   });

//   if (!employees) {
//     return empList, remoteEmp;
//   }

//   employees.forEach((employee) => {
//     empList = empList.map((emp) => {
//       if (emp === employee._id.toString()) {
//         remoteEmp.push(emp);
//       }
//     });
//   });

//   employees.forEach((employee) => {
//     empList = empList.filter((emp) => emp !== employee._id.toString());
//   });

//   return empList, remoteEmp;
// }
