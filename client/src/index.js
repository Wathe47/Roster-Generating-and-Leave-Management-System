import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
