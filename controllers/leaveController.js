const LeaveRequest = require("../models/leaveModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllLeaves = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(LeaveRequest.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const leaves = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: leaves.length,
    data: {
      leave: leaves,
    },
  });
});

exports.createLeave = catchAsync(async (req, res, next) => {
  const newLeave = await LeaveRequest.create({
    employee: req.body.employee,
    date: req.body.date,
    type: req.body.type,
    reason: req.body.reason,
  });

  res.status(201).json({
    status: "success",
    data: {
      leave: newLeave,
    },
  });
});

exports.getLeave = catchAsync(async (req, res, next) => {
  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) {
    return next(new AppError("No leave found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      leave,
    },
  });
});

exports.getMyLeaves = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    LeaveRequest.find({ employee: req.body.employee }),
    req.query
  ).filter();

  const leaves = await features.query;

  if (!leaves) {
    return next(new AppError("No leaves found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: leaves.length,
    data: {
      leave: leaves,
    },
  });
});

exports.approveLeave = catchAsync(async (req, res, next) => {
  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) return next(new AppError("No leave found with that ID", 404));

  const { status, reason, approved_rejectedBy } = req.body;

  leave.approveLeave(status, reason, approved_rejectedBy);

  res.status(200).json({
    status: "success",
    data: {
      leave,
    },
  });
});

exports.getEligibleList = catchAsync(async (req, res, next) => {
  const date = new Date(req.params.date);
  console.log(date);
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

  console.log(eligibleList.eligibleEmployees["SoftwareEngineer"]);

  await Promise.all(
    leaves.map(async (leave) => {
      const eligibleEmp = await User.findById(leave.employee);

      if (eligibleEmp) {
        const role = eligibleEmp.jobTitle.split(" ").join("");

        eligibleList.eligibleEmployees[role].push(eligibleEmp._id.toString());
      }
    })
  );

  console.log(eligibleList.eligibleEmployees["SoftwareEngineer"]);

  res.status(200).json({
    status: "success",
    data: {
      eligibleList: eligibleList,
    },
  });
});
