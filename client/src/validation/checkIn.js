const validateCheckIn = (data) => {
  let errors = {};
  let isValid = true;

  if (!data.checkedIn) {
    errors.checkedIn = "Please check the 'Checked In' checkbox.";
    isValid = false;
  }

  return {
    errors,
    isValid,
  };
};

export default validateCheckIn;
