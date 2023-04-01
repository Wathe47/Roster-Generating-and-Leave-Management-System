import {
    FETCH_ROSTER_SUCCESS,
    ADD_ROSTER_ITEM_SUCCESS,
    UPDATE_ROSTER_ITEM_SUCCESS,
    DELETE_ROSTER_ITEM_SUCCESS,
  } from "../actions/types";
  
  const initialState = {
    roster: [],
  };
  
  const rosterReducers = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ROSTER_SUCCESS:
        return {
          ...state,
          roster: action.roster,
        };
      case ADD_ROSTER_ITEM_SUCCESS:
        return {
          ...state,
          roster: [...state.roster, action.rosterItem],
        };
      case UPDATE_ROSTER_ITEM_SUCCESS:
        const updatedRoster = state.roster.map((item) =>
          item._id === action.rosterItem._id ? action.rosterItem : item
        );
        return {
          ...state,
          roster: updatedRoster,
        };
      case DELETE_ROSTER_ITEM_SUCCESS:
        const filteredRoster = state.roster.filter(
          (item) => item._id !== action.itemId
        );
        return {
          ...state,
          roster: filteredRoster,
        };
      default:
        return state;
    }
  };
  
  export default rosterReducers;
  