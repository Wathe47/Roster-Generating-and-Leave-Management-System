import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoster, updateRosterItem } from "../actions/rosterActions";

const RosterList = () => {
  const dispatch = useDispatch();
  const rosterList = useSelector((state) => state.roster.list);

  useEffect(() => {
    dispatch(fetchRoster());
  }, [dispatch]);

  const handleCheckIn = (rosterItem) => {
    const updatedRosterItem = {
      ...rosterItem,
      checkedIn: true,
    };
    dispatch(updateRosterItem(updatedRosterItem));
  };

  const handleCheckOut = (rosterItem) => {
    const updatedRosterItem = {
      ...rosterItem,
      checkedIn: false,
    };
    dispatch(updateRosterItem(updatedRosterItem));
  };

  return (
    <div>
      <h1>Roster List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Checked In</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rosterList.map((rosterItem) => (
            <tr key={rosterItem._id}>
              <td>{rosterItem.name}</td>
              <td>{rosterItem.email}</td>
              <td>{rosterItem.checkedIn ? "Yes" : "No"}</td>
              <td>
                {rosterItem.checkedIn ? (
                  <button onClick={() => handleCheckOut(rosterItem)}>
                    Check Out
                  </button>
                ) : (
                  <button onClick={() => handleCheckIn(rosterItem)}>
                    Check In
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RosterList;
