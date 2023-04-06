import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchRoster,
  addRosterItem,
  updateRosterItem,
  deleteRosterItem,
} from "../../actions/rosterActions";
import "./RosterCheckin.css";

class Roster extends Component {
  state = {
    name: "",
    email: "",
    checkedIn: false,
    editingId: null,
  };

  componentDidMount() {
    this.props.fetchRoster();
  }

  handleAddRosterItem = (e) => {
    e.preventDefault();
    this.props.addRosterItem(
      this.state.name,
      this.state.email,
      this.state.checkedIn
    );
    this.setState({
      name: "",
      email: "",
      checkedIn: false,
    });
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

  handleCheckInOut = (id, isCheckedIn) => {
    this.props.updateRosterItem(id, null, null, !isCheckedIn);
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
            Name:
            <input
              type="text"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </label>
          <label>
            Checked In:
            <input
              type="checkbox"
              checked={this.state.checkedIn}
              onChange={(e) => this.setState({ checkedIn: e.target.checked })}
            />
          </label>
          <button type="submit">
            {this.state.editingId ? "Update" : "Add"}
          </button>
        </form>

        <ul className="checkin--ul">
          {roster?.map((item) => (
            <li className="checkin--li" key={item._id}>
              {item.name} {"  "} | {item.email} |{" "}
              {item.checkedIn
                ? `Checked In at ${item.checkInTime}`
                : "Not Checked In"}
              {/* <button className="check-in"
                onClick={() => this.handleCheckInOut(item._id, item.checkedIn)}
              >
                {item.checkedIn ? "Check Out" : "Check In"}
              </button>
              <button className="edit" onClick={() => this.handleEditRosterItem(item)}>
                Edit
              </button>
              <button className="delete" onClick={() => this.handleDeleteRosterItem(item._id)}>
                Delete
              </button> */}
            </li>
          ))}
        </ul>
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
