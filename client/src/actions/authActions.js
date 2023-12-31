import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register user
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // Save to localStorage
      const { token } = res.data;

      // CHECK WHETHER OLD TOKEN IS PRESENT OR NOT
      const oldToken = localStorage.getItem("jwtToken");

      if (oldToken) {
        // REMOVE OLD TOKEN FROM LOCAL STORAGE
        localStorage.removeItem("jwtToken");
        setAuthToken(false);
        setCurrentUser({});
      }

      // SET NEW TOKEN TO LOCAL STORAGE

      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // decode token
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Logout user
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Check for token to keep user logged in
export const checkToken = () => (dispatch) => {
  // Get token from local storage
  const token = localStorage.getItem("jwtToken");
  console.log("Token:", token);
  // Check if token is present
  if (token) {
    // Set token to Auth header
    setAuthToken(token);
    console.log("Token found");
    // decode token
    const decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
  } else {
    console.log("Token not found");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will also set isAuthenticated to false
    dispatch(setCurrentUser({}));
  }
};

// ADMIN USER CHECK
export const isAdmin = () => {
  //GET TOKEN FROM LOCAL STORAGE
  const token = localStorage.getItem("jwtToken");
  let isAdmin = false;

  if (token) {
    const { jobTitle } = jwt_decode(token);
    console.log("Job title:", jobTitle);

    if (
      jobTitle === "Chief Executive Officer" ||
      jobTitle === "Chief Operating Officer"
    ) {
      isAdmin = true;
    }
  }

  return isAdmin;
};
