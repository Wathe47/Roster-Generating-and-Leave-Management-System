import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class NavbarDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToLogin: false,
    };
  }

  render() {
    const { isAuthenticated } = this.props.auth; //user

    const authLinks = (
      <>
        <li>
          <Link className="nav-link" to="/dashboard">
            DASHBOARD
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/empRoster">
            ROSTER
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/leave">
            LEAVE
          </Link>
        </li>
        {/* <li onClick={this.handleLogout} className="nav-link">
          LOGOUT
        </li> */}
      </>
    );

    const guestLinks = (
      <>
        <li>
          <Link className="nav-link" to="/">
            HOME
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/about">
            ABOUT
          </Link>
        </li>
      </>
    );

    if (this.state.redirectToLogin) {
      return <Redirect to="/" />;
    }

    return (
      <div className={this.props.mode}>
        <nav>
          <Link className="nav-link" to="/">
            <img src="logo.png" alt="logo" className="nav--logo"></img>
          </Link>
          <ul className="nav--list">
            {isAuthenticated ? authLinks : guestLinks}
            {/* {isAuthenticated && (
              <li>
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="nav--profilePhoto"
                />
              </li>
            )} */}
          </ul>
        </nav>
      </div>
    );
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
    this.setState({ redirectToLogin: true });
  };
}

NavbarDashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(NavbarDashboard);
