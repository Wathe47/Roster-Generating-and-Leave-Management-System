const { google } = require("googleapis");
const calendar = google.calendar("v3");

const apiKey = process.env.GOOGLE_API_KEY;
const calendarId = "en.lk#holiday@group.v.calendar.google.com";

exports.isAHoliday = async (enteredDate) => {
  const startDate = new Date(enteredDate);
  const endDate = new Date(enteredDate);
  endDate.setDate(startDate.getDate() + 1);

  let status = false;

  try {
    const response = await calendar.events.list({
      key: apiKey,
      calendarId: calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;

    if (events.length) {
      events.map((event) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
        status = true;
      });
    } else {
      console.log("No holidays found.");
    }
  } catch (error) {
    console.log(error);
  }
  return status;
};

exports.isWeekend = (enteredDate) => {
  let status = false;

  const date = new Date(enteredDate);
  const day = date.getDay();
  if (day === 0 || day === 6) {
    status = true;
  }
  return status;
};

exports.getNameOfDay = (enteredDate) => {
  const date = new Date(enteredDate);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = date.getDay();
  return dayNames[dayIndex];
};

exports.isValidDate = (dateString) => {
  const date = new Date(dateString);
  if (date.toISOString().split("T")[0] === dateString) {
    return true;
  }
  return false;
};
