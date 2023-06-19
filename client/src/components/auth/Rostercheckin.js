import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import {
  fetchRoster,
  addRosterItem,
  updateRosterItem,
  deleteRosterItem,
} from "../../actions/rosterActions";
import "./RosterCheckin.css";
import validateCheckIn from "../../validation/checkIn"; // Import form validation logic

class Roster extends Component {
  state = {
    checkedIn: false,
    editingId: null,
    errors: {},
  };

  componentDidMount() {
    this.props.fetchRoster(); // Fetch roster data when the component mounts
  }

  handleAddRosterItem = (e) => {
    e.preventDefault();
    const { name, email } = this.props.auth.user; // Get the logged-in user's name and email

    const { errors, isValid } = validateCheckIn(this.state); // Validate the check-in input

    if (isValid) {
      // If input is valid, add a roster item
      this.props.addRosterItem(name, email, this.state.checkedIn);
      this.setState({
        checkedIn: true,
        errors: {},
      });
    } else {
      // If the form input is invalid, set the errors state and show a toast error message
      this.setState({ errors });
      toast.error("Please check the 'Checked In' checkbox.");
    }
  };

  handleUpdateRosterItem = (e) => {
    e.preventDefault();
    this.props.updateRosterItem(
      this.state.editingId,
      this.state.name,
      this.state.email,
      this.state.checkedIn
    ); // Update a roster item
    this.setState({
      name: "",
      email: "",
      checkedIn: false,
      editingId: null,
    });
  };

  handleDeleteRosterItem = (id) => {
    this.props.deleteRosterItem(id); // Delete a roster item
  };

  handleCheckInOut = (
    id,
    name,
    email,
    checkInTime,
    checkOutTime,
    checkedIn
  ) => {
    const currentTime = new Date().toISOString();
    const thisCheckOutTime = checkedIn ? currentTime : null;

    this.props.updateRosterItem(
      id,
      name,
      email,
      checkedIn,
      checkInTime,
      thisCheckOutTime
    ); // Update the check-in/out status and times of a roster item
  };

  handleEditRosterItem = (item) => {
    this.setState({
      editingId: item._id,
      name: item.name,
      email: item.email,
      checkedIn: item.checkedIn,
    }); // Set the state to edit a roster item
  };

  render() {
    const { roster } = this.props;
    const { errors } = this.state;

    return (
      <div className="checkin">
        <ToastContainer /> {/* Container for toast notifications */}
        <br />
        <br />
        <h1>Roster</h1>
        <br />
        <form onSubmit={this.handleAddRosterItem}>
          <label>
            Checked In:
            <input
              type="checkbox"
              checked={this.state.checkedIn}
              onChange={(e) =>
                this.setState({ checkedIn: e.target.checked, errors: {} })
              }
            />
          </label>
          {errors.checkedIn && (
            <div className="error-message">{errors.checkedIn}</div>
          )}
          <button type="submit">
            {this.state.editingId ? "Update" : "CHECK IN"}
          </button>
        </form>
        <table className="roster-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roster?.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  {item.checkInTime
                    ? new Date(item.checkInTime).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {item.checkOutTime
                    ? new Date(item.checkOutTime).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {!item.checkOutTime ? (
                    <>
                      <button
                        className="check-out"
                        onClick={() =>
                          this.handleCheckInOut(
                            item._id,
                            item.name,
                            item.email,
                            item.checkInTime,
                            item.checkOutTime,
                            item.checkedIn
                          )
                        }
                      >
                        Check Out
                      </button>
                      {/* <button
                        className="delete"
                        onClick={() => this.handleDeleteRosterItem(item._id)}
                      >
                        Delete
                      </button> */}
                    </>
                  ) : (
                    <span>Checked Out</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="checkin--devider"></div>
        {this.props.loading && <div>Loading...</div>}
        {this.props.error && <div>Error: {this.props.error}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  roster: state.roster.roster,
  loading: state.roster.loading,
  error: state.roster.error,
});

export default connect(mapStateToProps, {
  fetchRoster,
  addRosterItem,
  updateRosterItem,
  deleteRosterItem,
})(Roster);