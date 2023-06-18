import React, { Component } from "react";
import { motion } from "framer-motion";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import { updateProfilePicture } from "../../actions/profileActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

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
  handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const filePreview = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("file", file);
    this.setState({ filePreview, formData });
  };

  handleProfilePictureSubmit = (e) => {
    e.preventDefault();
    const { formData } = this.state;
    this.props.updateProfilePicture(formData);
    this.setState({ filePreview: null, formData: null });
  };

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const { auth } = this.props;
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/adminLogin" />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
        <div className="dashboard__header">
          <h1 className="dashboard__title">Admin Dashboard</h1>
          <button
            className="dashboard__logoutButton"
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__profileSection">
            <div className="dashboard__profileInfo">
              <h2 className="dashboard__greeting">
                Hi, {auth.user.name.split(" ")[0]}!
              </h2>
              <p className="dashboard__jobTitle">
                <b>Job Title:</b> {auth.user.jobTitle}
              </p>
              <p className="dashboard__currentTime">{this.state.time}</p>
            </div>
          </div>
          <div className="dashboard__actionSection">
            {/* <button className="dashboard__actionButton">Check In</button> */}
            <Link to="/rosterCheckin" style={{ textDecoration: "none" }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="checkin.jpeg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h7" component="div">
                      CHECKIN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Let's do some good work!
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>

            {/* <Link to="/leave">
              <button className="dashboard__actionButton">Request Leave</button>
            </Link>
            <Link to="/roster">
              <button className="dashboard__actionButton">View Roster</button>
            </Link> */}
            <Link to="/adminLeave" style={{ textDecoration: "none" }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="leave.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h7" component="div">
                      LEAVE MANAGE
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage Leaves.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
            <Link to="/empRoster" style={{ textDecoration: "none" }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="roster.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h7" component="div">
                      ROSTER
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your Job Roster.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
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

export default connect(mapStateToProps, { logoutUser, updateProfilePicture })(
  Dashboard
);
