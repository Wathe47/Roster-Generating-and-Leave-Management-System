const LeaveRequest = require("../models/leaveModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { isAHoliday, isWeekend } = require("../utils/holidayAPI");
const Email = require("../utils/email");
const { admin } = require("googleapis/build/src/apis/admin");

const { ObjectId } = require("mongoose").Types;

exports.getAllLeaves = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(LeaveRequest.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const leaves = await features.query.populate({
    path: "employee",
    select: "name jobTitle",
  });

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
  const { id, date, type, reason } = req.body;
  const employee = id;
  // const employee = currentemp._id.toString();

  //FIRST CHECK EMPLOYEE IS EXISTS
  if (!employee) {
    return next(new AppError("No Employee", 404));
  }

  //CHECK WHETHER DATE IS WEEKEND OR NOT
  const weekend = isWeekend(date);
  if (weekend) {
    return next(new AppError("Failed! Selected date is not a weekday", 404));
  }

  //CHECK WHETHER DATE IS HOLIDAY OR NOT
  const Holiday = await isAHoliday(date);
  if (Holiday) {
    return next(new AppError("Failed! Selected date is a holiday", 404));
  }

  //CHECK WHETHER EMPLOYEE ALREADY APPLIED LEAVE ON THAT DATE
  const alreadyApplied = await LeaveRequest.findOne({
    employee: ObjectId(employee),
    date: date,
    status: "pending",
  });

  if (alreadyApplied) {
    return next(new AppError("Leave Request already applied.", 404));
  }

  //CHECK WHETHER EMPLOYEE ALREADY APPLIED LEAVE ON THAT DATE
  const approvedLeave = await LeaveRequest.findOne({
    employee: ObjectId(employee),
    date: date,
    status: "approved",
  });

  if (approvedLeave) {
    return next(new AppError("Leave Request already approved.", 404));
  }

  //IF ALL CHECKS ARE PASSED THEN CREATE LEAVE REQUEST
  const newLeave = await LeaveRequest.create({
    employee: employee,
    date: date,
    type: type,
    reason: reason,
  });

  //SEND THE NOTIFICATION EMAIL
  // const jobTitles = [
  //   "Chief Executive Officer",
  //   "Chief Operating Officer",
  //   "Human Resources/Administrative",
  // ];
  // const adminUsers = await User.find({ jobTitle: { $in: jobTitles } });
  // const url = "#";

  // adminUsers.forEach(async (adminUser) => {
  //   await new Email(adminUser, url, currentemp, newLeave).sendNotifyLeave();
  // });

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
  const employee = req.user._id.toString();

  //GENERATE QUERY
  // const features = new APIFeatures(
  //   LeaveRequest.find({ employee }),
  //   req.query
  // ).filter();

  // const leaves = await features.query;
  // console.log(leaves);

  const pendingLeaves = await LeaveRequest.find({
    employee: ObjectId(employee),
    status: "pending",
  });

  const approvedLeaves = await LeaveRequest.find({
    employee: ObjectId(employee),
    status: "approved",
  });

  // if (!leaves.length) {
  //   return next(new AppError("No leaves found with that ID", 404));
  // }

  res.status(200).json({
    status: "success",
    data: {
      pendingLeaves,
      approvedLeaves,
    },
  });
});

exports.approveLeave = catchAsync(async (req, res, next) => {
  const { leaveID, status, reason } = req.body;

  const currentemp = req.user;
  const approved_rejectedBy = currentemp._id.toString();

  //CHECK WHETHER LEAVE IS EXISTS WITH THAT ID

  const leave = await LeaveRequest.findById(leaveID);
  if (!leave) return next(new AppError("No leave found with that ID", 404));

  //CHECK WHETHER LEAVE IS ALREADY APPROVED OR REJECTED

  if (leave.status === "approved" || leave.status === "rejected") {
    return next(
      new AppError("Leave is already " + leave.status + " by admin", 404)
    );
  }

  //CHECK WHETHER SAME USER IS APPROVING OR REJECTING THE LEAVE

  if (leave.employee.toString() === approved_rejectedBy) {
    return next(
      new AppError("You can't approve or reject your own leave request", 404)
    );
  }

  //IF ALL CHECKS ARE PASSED THEN APPROVE OR REJECT THE LEAVE
  leave.approveLeave(status, reason, approved_rejectedBy);

  //SEND THE NOTIFICATION EMAIL
  const requestedleaveUser = await User.findById(leave.employee.toString());

  if (leave.status === "approved") {
    await new Email(
      requestedleaveUser,
      "#",
      currentemp,
      leave
    ).sendLeaveApproved();
  }

  if (leave.status === "rejected") {
    await new Email(
      requestedleaveUser,
      "#",
      currentemp,
      leave
    ).sendLeaveRejected();
  }

  res.status(200).json({
    status: "success",
    data: {
      leave,
    },
  });
});

//NEW ROUTES APPPROVE LEAVE
exports.approveLeaveNew = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const currentemp = req.user;
  const approved_rejectedBy = currentemp._id.toString();

  //CHECK WHETHER LEAVE IS EXISTS WITH THAT ID
  const leave = await LeaveRequest.findById(id);
  if (!leave) return next(new AppError("No leave found with that ID", 404));

  //CHECK WHETHER LEAVE IS ALREADY APPROVED OR REJECTED

  if (leave.status === "approved" || leave.status === "rejected") {
    return next(
      new AppError("Leave is already " + leave.status + " by admin", 404)
    );
  }

  //CHECK WHETHER SAME USER IS APPROVING OR REJECTING THE LEAVE

  if (leave.employee.toString() === approved_rejectedBy) {
    return next(
      new AppError("You can't approve or reject your own leave request", 404)
    );
  }

  //IF ALL CHECKS ARE PASSED THEN APPROVE OR REJECT THE LEAVE
  leave.approveLeave("approved", "", approved_rejectedBy);

  //SEND THE NOTIFICATION EMAIL
  const requestedleaveUser = await User.findById(leave.employee.toString());

  await new Email(
    requestedleaveUser,
    "#",
    currentemp,
    leave
  ).sendLeaveApproved();

  res.status(200).json({
    status: "success",
  });
});

//NEW ROUTES REJECT LEAVE
exports.rejectLeaveNew = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const currentemp = req.user;
  const approved_rejectedBy = currentemp._id.toString();

  //CHECK WHETHER LEAVE IS EXISTS WITH THAT ID
  const leave = await LeaveRequest.findById(id);
  if (!leave) return next(new AppError("No leave found with that ID", 404));

  //CHECK WHETHER LEAVE IS ALREADY APPROVED OR REJECTED

  if (leave.status === "approved" || leave.status === "rejected") {
    return next(
      new AppError("Leave is already " + leave.status + " by admin", 404)
    );
  }

  //CHECK WHETHER SAME USER IS APPROVING OR REJECTING THE LEAVE

  if (leave.employee.toString() === approved_rejectedBy) {
    return next(
      new AppError("You can't approve or reject your own leave request", 404)
    );
  }

  //IF ALL CHECKS ARE PASSED THEN APPROVE OR REJECT THE LEAVE
  leave.approveLeave("rejected", "", approved_rejectedBy);

  //SEND THE NOTIFICATION EMAIL
  const requestedleaveUser = await User.findById(leave.employee.toString());

  await new Email(
    requestedleaveUser,
    "#",
    currentemp,
    leave
  ).sendLeaveRejected();

  res.status(200).json({
    status: "success",
  });
});
