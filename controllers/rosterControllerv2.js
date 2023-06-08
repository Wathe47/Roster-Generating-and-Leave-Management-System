const AppError = require("../utils/appError");
const User = require("../models/userModel");
const MoreInfo = require("../models/moreinfoModel");

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
