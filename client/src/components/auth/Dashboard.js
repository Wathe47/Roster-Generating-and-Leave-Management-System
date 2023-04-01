import React, { Component } from "react";
import { motion } from "framer-motion";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    time: new Date().toLocaleTimeString(),
    profilePicture: null,
    filePreview: null,
    redirect: false,
  };

  componentDidMount() {
    this.intervalID = setInterval(() => {
      this.setState({ time: new Date().toLocaleTimeString() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const { auth } = this.props;
    const { filePreview, redirect } = this.state;

    if (redirect) {
      return <Redirect to="/login" />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
        <div className="dashboard__header">
          <h1 className="dashboard__title">Dashboard</h1>
          <button
            className="dashboard__logoutButton"
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__profileSection">
            <img
              src={filePreview || auth.user.avatar}
              alt="Profile"
              className="dashboard__profilePhoto"
            />
            <div className="dashboard__profileInfo">
              <h2 className="dashboard__greeting">
                Hi, {auth.user.name.split(" ")[0]}!
              </h2>
              <p className="dashboard__jobTitle">
                <b>Job Title:</b> {auth.user.jobTitle}
              </p>
              <p className="dashboard__currentTime">
                <b>Current Time:</b> {this.state.time}
              </p>
            </div>
          </div>
          <div className="dashboard__actionSection">
            <Link to="/leave">
              <button className="dashboard__actionButton">Request Leave</button>
            </Link>
            <Link to="/roster">
              <button className="dashboard__actionButton">View Roster</button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
    this.setState({ redirect: true });
  };
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
