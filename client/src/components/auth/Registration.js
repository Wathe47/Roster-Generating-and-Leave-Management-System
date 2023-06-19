import React, { Component } from "react";
import { PropTypes } from "prop-types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { motion } from "framer-motion";
import validateRegistrationInput from "../../validation/register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
    };

    const { errors, isValid } = validateRegistrationInput(newUser);

    if (isValid) {
      this.props.registerUser(newUser, this.props.history);
    } else {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
        <img
          src="register--image.png"
          alt="register-back"
          className="register--image"
        ></img>
        <div className="register">
          <form
            className="register--form--full"
            noValidate
            onSubmit={this.onSubmit}
          >
            <div className="register--heading">REGISTRATION</div>
            <div className="register--inputfields">
              <TextField
                id="outlined-name-input"
                label="Name"
                className={classNames("register--form", {
                  "is-invalid": errors.name,
                })}
                value={this.state.name}
                type="text"
                onChange={this.onChange}
                name="name"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="register--inputfields">
              <TextField
                id="outlined-email-input"
                label="Email"
                value={this.state.email}
                type="text"
                name="email"
                className={classNames("register--form", {
                  "is-invalid": errors.email,
                })}
                onChange={this.onChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="register--inputfields">
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                className={classNames("register--form", {
                  "is-invalid": errors.password,
                })}
                value={this.state.password}
                onChange={this.onChange}
                name="password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <div className="register--inputfields">
              <TextField
                id="outlined-passwordConfirm-input"
                label="Confirm Password"
                type="password"
                className={classNames("register--form", {
                  "is-invalid": errors.passwordConfirm,
                })}
                value={this.state.passwordConfirm}
                onChange={this.onChange}
                name="passwordConfirm"
              />
              {errors.passwordConfirm && (
                <div className="invalid-feedback">{errors.passwordConfirm}</div>
              )}
            </div>
            <div className="register--inputfields">
              <Button
                sx={{ mt: 1, mr: 1 }}
                type="submit"
                variant="outlined"
                className="register--form--button"
              >
                SUBMIT
              </Button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </motion.div>
    );
  }
}

Registration.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(
  withRouter(Registration)
);
