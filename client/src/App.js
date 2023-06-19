import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { Provider } from "react-redux";
import store from "./store";

import "./style.css";

import Navbar from "./components/layout/Navbar";
import Content from "./components/layout/Content";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import About from "./components/auth/About";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/auth/Dashboard";
import Leave from "./components/auth/Leave";
import NavbarDashboard from "./components/layout/NavbarDashboard";
import Roster from "./components/auth/Roster";
import Rostercheckin from "./components/auth/Rostercheckin";

import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { setCurrentUser } from "./actions/authActions";
import RosterCreate from "./components/auth/RosterCreate";
import Emproster from "./components/auth/EMP_Roster";
import MonthlyReport from "./components/auth/MonthlyReport";
import AdminLogin from "./components/auth/LoginAdmin";
import AdminDashboard from "./components/auth/DashboardAdmin";
import AdminNavbarDashboard from "./components/layout/AdminNavbarDashboard";
import AdminLeave from "./components/auth/AdminLeave";

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
}

let date = new Date();
const hours = date.getHours();
let mode;
if (hours >= 6 && hours <= 20) {
  mode = "light";
} else {
  mode = "light";
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <CompatRouter>
              <Switch>
                <React.Fragment>
                  <Route
                    exact
                    path="/"
                    render={(props) => <Navbar mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/"
                    render={(props) => <Content mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/login"
                    render={(props) => <Navbar mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/login"
                    render={(props) => <Login mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/register"
                    render={(props) => <Navbar mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/register"
                    render={(props) => <Registration mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/about"
                    render={(props) => <Navbar mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/about"
                    render={(props) => <About mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/forgotpassword"
                    render={(props) => <Navbar mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/forgotpassword"
                    render={(props) => (
                      <ForgotPassword mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/dashboard"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/dashboard"
                    render={(props) => <Dashboard mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/leave"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  {/* <Route
                    exact
                    path="/leave"
                    render={(props) => <Dashboard mode={mode} {...props} />}
                  ></Route> */}
                  <Route
                    exact
                    path="/leave"
                    render={(props) => <Leave mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/roster"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/roster"
                    render={(props) => <Roster mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/rosterCreate"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/rosterCreate"
                    render={(props) => <RosterCreate mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/empRoster"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/empRoster"
                    render={(props) => <Emproster mode={mode} {...props} />}
                  ></Route>
                  <Route
                    exact
                    path="/rostercheckin"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/rostercheckin"
                    render={(props) => <Rostercheckin mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/monthlyreport"
                    render={(props) => (
                      <NavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/monthlyreport"
                    render={(props) => <MonthlyReport mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/adminLogin"
                    render={(props) => (
                      <AdminNavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/adminLogin"
                    render={(props) => <AdminLogin mode={mode} {...props} />}
                  ></Route>

                  <Route
                    exact
                    path="/adminDashboard"
                    render={(props) => (
                      <AdminNavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/adminDashboard"
                    render={(props) => (
                      <AdminDashboard mode={mode} {...props} />
                    )}
                  ></Route>

                  <Route
                    exact
                    path="/adminLeave"
                    render={(props) => (
                      <AdminNavbarDashboard mode={mode} {...props} />
                    )}
                  ></Route>
                  <Route
                    exact
                    path="/adminLeave"
                    render={(props) => <AdminLeave mode={mode} {...props} />}
                  ></Route>
                </React.Fragment>
              </Switch>
            </CompatRouter>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
