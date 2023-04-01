import React, { useState } from "react";
import { connect } from "react-redux";
import { checkIn, checkOut } from "../redux/actions";

const Employee = ({ employee, checkIn, checkOut }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    checkIn(employee);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    checkOut(employee);
    setIsCheckedIn(false);
  };

  return (
    <div>
      <h2>{employee.name}</h2>
      <p>{employee.position}</p>
      <p>{employee.email}</p>
      {isCheckedIn ? (
        <button onClick={handleCheckOut}>Check Out</button>
      ) : (
        <button onClick={handleCheckIn}>Check In</button>
      )}
    </div>
  );
};

export default connect(null, { checkIn, checkOut })(Employee);
