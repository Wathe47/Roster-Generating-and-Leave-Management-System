const User = require("../models/userModel");
//const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const fs = require("fs");
const MoreInfo = require("../models/moreinfoModel");

const filterObj = (Obj, ...allowedFields) => {
  //...allowedFields is an array of strings
  const newObj = {};
  //Object.keys(Obj) returns an array of keys of Obj
  Object.keys(Obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = Obj[el];
    } //if el is in allowedFields, then add it to newObj
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated.
  const filteredBody = filterObj(req.body, "emp_name", "emp_email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addToDepartment = catchAsync(async (req, res, next) => {
  const { employeeID, departmentdetails, current, workSince, workTo } =
    req.body;

  const newassigneddepartment = {
    departmentdetails,
    current,
    workSince,
    workTo,
  };

  const user = await User.findByIdAndUpdate(employeeID);

  if (user.departments.length > null) {
    user.departments[0].current = false;
    user.departments[0].workTo = workSince;
  }

  user.departments.unshift(newassigneddepartment);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

// add more info to the user
exports.addMoreInfo = catchAsync(async (req, res, next) => {
  const { employee, distance, isPregnant, isInfantChildren } = req.body;

  const user = await User.findById(employee);

  if (!user) {
    return next(new AppError("There is no user with relevant ID.", 404));
  }

  const moreInfo = await MoreInfo.create({
    employee,
    distance,
    isPregnant,
    isInfantChildren,
  });

  res.status(200).json({
    status: "success",
    data: {
      moreInfo,
    },
  });
});

exports.updateMoreInfo = catchAsync(async (req, res, next) => {
  const { employee, distance, isPregnant, isInfantChildren } = req.body;

  const moreInfo = await MoreInfo.findOneAndUpdate(employee, {
    distance,
    isPregnant,
    isInfantChildren,
  });

  if (!moreInfo) {
    return next(new AppError("There is no more info with relevant ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      moreInfo,
    },
  });
});

// For testing purposes only
exports.testingEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  console.log(user.empName);

  return new Email(user, "http://localhost:3000/").sendTesting();
});

exports.generateTestUsers = catchAsync(async (req, res, next) => {
  const usersFilePath = `${__dirname}/../dev-data/users.json`;

  const usersData = fs.readFileSync(usersFilePath, "utf-8");

  const users = JSON.parse(usersData);

  const createdUsers = await User.create(users);

  res.status(200).json({
    status: "success",
    message: "Test Users created successfully!",
    data: {
      numberOfUsers: createdUsers.length,
    },
  });
});
