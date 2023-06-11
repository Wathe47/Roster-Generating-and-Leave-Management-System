// ======= TESTING PURPOSES ONLY ========

const User = require("../models/userModel");
const LeaveRequest = require("../models/leaveModel");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");

async function generateDummyData(jsonName, model) {
  const filePath = `${__dirname}/../dev-data/${jsonName}.json`;
  const data = fs.readFileSync(filePath, "utf-8");
  const parsedData = JSON.parse(data);

  try {
    await model.create(parsedData);
  } catch (error) {
    console.log(error);
  }
}

exports.generateDummyUsers = catchAsync(async (req, res, next) => {
  await generateDummyData("leaves20", LeaveRequest);
  res.status(200).json({
    status: "success",
  });
});
