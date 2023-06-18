import axios from "axios";
import {
  FETCH_ROSTER_SUCCESS,
  ADD_ROSTER_ITEM_SUCCESS,
  UPDATE_ROSTER_ITEM_SUCCESS,
  DELETE_ROSTER_ITEM_SUCCESS,
} from "./types";

// Fetch all roster items
export const fetchRoster = () => async (dispatch, getState) => {
  try {
    const { email } = getState().auth.user; // Get the logged-in user's email
    const res = await axios.get(`/api/roster?email=${email}`);
    dispatch({
      type: FETCH_ROSTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
  }
};

// Add a roster item
export const addRosterItem = (name, email, checkedIn) => async (dispatch) => {
  try {
    const res = await axios.post("/api/roster", { name, email, checkedIn });
    dispatch({
      type: ADD_ROSTER_ITEM_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
  }
};

// Update a roster item
// Update a roster item
export const updateRosterItem =
  (id, name, email, checkedIn, checkInTime, checkOutTime) =>
  async (dispatch) => {
    try {
      const res = await axios.put(`/api/roster/update/${id}`, {
        id,
        name,
        email,
        checkedIn,
        checkInTime,
        checkOutTime,
      });
      dispatch({
        type: UPDATE_ROSTER_ITEM_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

// Delete a roster item
export const deleteRosterItem = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/roster/${id}`);
    dispatch({
      type: DELETE_ROSTER_ITEM_SUCCESS,
      payload: id,
    });
  } catch (err) {
    console.error(err);
  }
};