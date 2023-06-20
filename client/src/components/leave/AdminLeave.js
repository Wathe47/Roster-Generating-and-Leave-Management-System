import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import LeavePendingRequest from "./LeavePendingRequest";
import "./leave.css";
import { toast } from "react-toastify";

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

    try {
      const res = await axios.patch(url, {});

      if (res.status === 200) {
        toast.success("Leave Approved", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        getPendingRequests();
      }
    } catch (error) {
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

  const handleReject = async (id) => {
    const url = `/api/leaves/reject/${id}`;
    try {
      const res = await axios.patch(url, {});

      if (res.status === 200) {
        console.log("Leave Rejected");

        toast.success("Leave Rejected", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        getPendingRequests();
      }
    } catch (error) {
      console.log(error);
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
