import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import "./leave.css";

// Component for rendering individual leave requests
const LeaveRequest = ({ date, type, reason, onApprove, onReject }) => {
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
      <div>
        <Button onClick={onApprove}>Approve</Button>
        <Button onClick={onReject}>Reject</Button>
      </div>
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
      // Dummy data for pending requests
      const pendingRequestsData = [
        {
          date: "2023-06-01",
          type: "vacation",
          reason: "Family vacation",
        },
        {
          date: "2023-06-05",
          type: "sick",
          reason: "Fever",
        },
      ];

      // Dummy data for approved requests
      const approvedRequestsData = [
        {
          date: "2023-06-10",
          type: "vacation",
          reason: "Holiday trip",
        },
      ];

      this.setState({
        pendingRequests: pendingRequestsData,
        approvedRequests: approvedRequestsData,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidMount() {
    await this.getLeaveData();
  }

  handleApproveRequest = (index) => {
    const { pendingRequests, approvedRequests } = this.state;
    const approvedRequest = pendingRequests[index];
    const newPendingRequests = [...pendingRequests];
    newPendingRequests.splice(index, 1);
    const newApprovedRequests = [...approvedRequests, approvedRequest];

    this.setState({
      pendingRequests: newPendingRequests,
      approvedRequests: newApprovedRequests,
    });
  };

  handleRejectRequest = (index) => {
    const { pendingRequests } = this.state;
    const newPendingRequests = [...pendingRequests];
    newPendingRequests.splice(index, 1);

    this.setState({
      pendingRequests: newPendingRequests,
    });
  };

  render() {
    const {
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
          LEAVE MANAGEMENT
        </h1>

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
                    onApprove={() => this.handleApproveRequest(index)}
                    onReject={() => this.handleRejectRequest(index)}
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
