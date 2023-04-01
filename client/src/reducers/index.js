import { combineReducers } from "redux";
import authReducer from './authReducer';
import errorReducer from "./errorReducer";
import rosterReducers from "./rosterReducers";

export default combineReducers( {
    auth: authReducer,
    errors: errorReducer,
    roster: rosterReducers,
});