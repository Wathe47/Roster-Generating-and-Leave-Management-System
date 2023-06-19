import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import LeavePendingRequest from "./LeavePendingRequest";
import "./leave.css";

const AdminLeave = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  const getPendingRequests = async () => {
    const res = await axios.get("/api/leaves?status=pending");

    setPendingRequests(res.data.data.leave);
  };

  useEffect(() => {
    getPendingRequests();
  }, []);

  const handleApprove = async (id) => {
    const url = `/api/leaves/approve/${id}`;

    axios
      .patch(url, {})
      .then((res) => {
        if (res.status === 200) {
          getPendingRequests();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleReject = (id) => {
    const url = `/api/leaves/reject/${id}`;

    axios
      .patch(url, {})
      .then((res) => {
        if (res.status === 200) {
          getPendingRequests();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="leave">
      {pendingRequests.length === 0 && <h1>No Pending Leaves</h1>}
      {pendingRequests.map((request, index) => {
        return (
          <LeavePendingRequest
            key={index}
            name={request.employee.name}
            jobTitle={request.employee.jobTitle}
            date={request.date}
            type={request.type}
            reason={request.reason}
            onApprove={() => handleApprove(request._id)}
            onReject={() => handleReject(request._id)}
          />
        );
      })}
    </div>
  );
};

export default AdminLeave;
