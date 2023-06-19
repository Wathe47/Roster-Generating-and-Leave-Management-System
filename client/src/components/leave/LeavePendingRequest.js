import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import "./leave.css";

// Component for rendering individual leave requests
const LeavePendingRequest = ({
  name,
  jobTitle,
  date,
  type,
  reason,
  onApprove,
  onReject,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="leave-request"
    >
      <div>
        Request by: {name} ({jobTitle})
      </div>
      <div>Date: {date}</div>
      <div>Type: {type}</div>
      <div>Reason: {reason}</div>
      <div className="leave-request-button">
        <Button variant="contained" color="success" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="contained" color="error" onClick={onReject}>
          Reject
        </Button>
      </div>
    </motion.div>
  );
};

export default LeavePendingRequest;
