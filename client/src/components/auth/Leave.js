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
import axios from "axios";
import "./leave.css";

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
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", this.state);

    const data = {
      date: this.state.date,
      type: this.state.type,
      reason: this.state.reason,
    };

    axios
      .post("/api/leaves", data)
      .then((res) => {
        console.log(res);
        this.getLeaveData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      [name]: value,
    });
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
      console.log(response.data.data.approvedLeaves);

      // Dummy data for pending requests
      // const pendingRequestsData = [
      //   {
      //     date: "2023-06-01",
      //     type: "vacation",
      //     reason: "Family vacation",
      //   },
      //   {
      //     date: "2023-06-05",
      //     type: "sick",
      //     reason: "Fever",
      //   },
      // ];

      // // Dummy data for approved requests
      // const approvedRequestsData = [
      //   {
      //     date: "2023-06-10",
      //     type: "vacation",
      //     reason: "Holiday trip",
      //   },
      // ];

      // Assuming the API response contains separate arrays for pending and approved requests
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
    } = this.state;

    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
        <br />
        <h1
          style={{
            marginLeft: "20%",
            fontSize: "30px",
            fontFamily: "Roboto",
            color: "rgb(89, 88, 88)",
          }}
        >
          LEAVE REQUEST FORM
        </h1>

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
          </form>
        </div>

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
      </motion.div>
    );
  }
}

export default Leave;
