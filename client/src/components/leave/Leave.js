import React from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { isAdmin } from "../../actions/authActions";
import "./leave.css";
import AdminLeave from "./AdminLeave";
import { toast } from "react-toastify";

// Component for rendering individual leave requests
const LeaveRequest = ({ date, type, reason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="leave-request"
    >
      <div>Date: {date}</div>
      <div>Type: {type}</div>
      <div>Reason: {reason}</div>
    </motion.div>
  );
};

class Leave extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: "",
      type: "",
      reason: "",
      pendingRequests: [],
      approvedRequests: [],
      showPendingRequests: false,
      showApprovedRequests: false,
      isAdmin: isAdmin(),
      leaveReview: false,
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      date: this.state.date,
      type: this.state.type,
      reason: this.state.reason,
    };

    try {
      const response = await axios.post("/api/leaves", data);

      if (response.status === 201) {
        toast.success("Leave request submitted successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        await this.getLeaveData();
        this.setState({
          date: "",
          type: "",
          reason: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      [name]: value,
    });
  };

  handleLeaveReviewButton = () => {
    console.log("Leave review button clicked");
    this.setState((prevState) => ({
      leaveReview: !prevState.leaveReview,
    }));
  };

  togglePendingRequests = () => {
    this.setState((prevState) => ({
      showPendingRequests: !prevState.showPendingRequests,
    }));
  };

  toggleApprovedRequests = () => {
    this.setState((prevState) => ({
      showApprovedRequests: !prevState.showApprovedRequests,
    }));
  };

  async getLeaveData() {
    try {
      const response = await axios.get("/api/leaves/mine").catch((err) => {
        console.log(err);
      });

      this.setState({
        pendingRequests: response.data.data.pendingLeaves,
        approvedRequests: response.data.data.approvedLeaves,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidMount() {
    await this.getLeaveData();
  }

  render() {
    const {
      date,
      type,
      reason,
      pendingRequests,
      approvedRequests,
      showPendingRequests,
      showApprovedRequests,
      isAdmin,
      leaveReview,
    } = this.state;

    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
        <br />
        <div className="leave-header">
          <h1
            style={{
              marginLeft: "20%",
              fontSize: "30px",
              fontFamily: "Roboto",
              color: "rgb(89, 88, 88)",
            }}
          >
            {leaveReview ? "LEAVE REVIEW" : "LEAVE REQUEST FORM"}
          </h1>
          {isAdmin && (
            <Button
              type="click"
              variant="contained"
              color="success"
              style={{ marginRight: "10px" }}
              onClick={this.handleLeaveReviewButton}
            >
              {leaveReview ? "ADD NEW LEAVE" : "REVIEW LEAVES"}
            </Button>
          )}
        </div>

        {leaveReview ? (
          <div>
            <AdminLeave />
          </div>
        ) : (
          <>
            <div className="leave">
              <form onSubmit={this.handleSubmit}>
                <TextField
                  label="Date"
                  type="date"
                  variant="outlined"
                  name="date"
                  value={date}
                  onChange={this.handleInputChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    name="type"
                    value={type}
                    onChange={this.handleInputChange}
                  >
                    <MenuItem value="vacation">Vacation</MenuItem>
                    <MenuItem value="sick">Sick</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Reason"
                  variant="outlined"
                  name="reason"
                  value={reason}
                  onChange={this.handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "1rem",
                    marginRight: "20%",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    style={{ marginRight: "10px" }}
                  >
                    Request
                  </Button>
                  <Link to="/dashboard" className="leave-close-button">
                    <Button variant="outlined">Close</Button>
                  </Link>
                </div>
              </form>
            </div>

            <div className="leave-requests">
              <h2>
                <Button onClick={this.togglePendingRequests}>
                  Pending Requests
                </Button>
              </h2>
              {showPendingRequests && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="leave-requests-table"
                >
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((request, index) => (
                      <LeaveRequest
                        key={index}
                        date={request.date}
                        type={request.type}
                        reason={request.reason}
                      />
                    ))
                  ) : (
                    <p>No pending requests</p>
                  )}
                </motion.div>
              )}
            </div>

            <div className="divider"></div>

            <div className="leave-requests">
              <h2>
                <Button onClick={this.toggleApprovedRequests}>
                  Approved Requests
                </Button>
              </h2>
              {showApprovedRequests && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="leave-requests-table"
                >
                  {approvedRequests.length > 0 ? (
                    approvedRequests.map((request, index) => (
                      <LeaveRequest
                        key={index}
                        date={request.date}
                        type={request.type}
                        reason={request.reason}
                      />
                    ))
                  ) : (
                    <p>No approved requests</p>
                  )}
                </motion.div>
              )}
            </div>
          </>
        )}
      </motion.div>
    );
  }
}

export default Leave;
