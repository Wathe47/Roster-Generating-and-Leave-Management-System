// Roster.js

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchRoster,
  addRosterItem,
  updateRosterItem,
  deleteRosterItem,
} from "../../actions/rosterActions";
import "./RosterCheckin.css";
import validateCheckIn from "../../validation/checkIn";

class Roster extends Component {
  state = {
    checkedIn: false,
    editingId: null,
    errors: {},
  };

  componentDidMount() {
    this.props.fetchRoster();
  }

  handleAddRosterItem = (e) => {
    e.preventDefault();
    const { name, email } = this.props.auth.user; // Get the logged-in user's name and email

    // Validate the check-in input
    const { errors, isValid } = validateCheckIn(this.state);

    if (isValid) {
      this.props.addRosterItem(name, email, this.state.checkedIn);
      this.setState({
        checkedIn: true,
        errors: {},
      });
    } else {
      // If the form input is invalid, set the errors state
      this.setState({ errors });
    }
  };

  handleUpdateRosterItem = (e) => {
    e.preventDefault();
    this.props.updateRosterItem(
      this.state.editingId,
      this.state.name,
      this.state.email,
      this.state.checkedIn
    );
    this.setState({
      name: "",
      email: "",
      checkedIn: false,
      editingId: null,
    });
  };

  handleDeleteRosterItem = (id) => {
    this.props.deleteRosterItem(id);
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
    );
  };

  handleEditRosterItem = (item) => {
    this.setState({
      editingId: item._id,
      name: item.name,
      email: item.email,
      checkedIn: item.checkedIn,
    });
  };

  render() {
    const { roster } = this.props;
    const { errors } = this.state;

    return (
      <div className="checkin">
        <br />
        <br />
        <h1>Roster</h1>
        <br />
        <form
          onSubmit={
            this.state.editingId
              ? this.handleUpdateRosterItem
              : this.handleAddRosterItem
          }
        >
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
                      <button
                        className="delete"
                        onClick={() => this.handleDeleteRosterItem(item._id)}
                      >
                        Delete
                      </button>
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
