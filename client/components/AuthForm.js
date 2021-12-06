import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { authenticate } from "../store";
import history from "../history";

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;
  const redirect = () => {
    window.location.pathname === "/signup"
      ? history.push("/questionaire")
      : history.push("/user");
  };
  return (
    <div className="LoginContainer">
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <h2
            className={
              window.location.pathname === "/login"
                ? "active"
                : "inactive underlineHover"
            }
          >
            <Link to="/login">Login</Link>
          </h2>
          <h2
            className={
              window.location.pathname === "/signup"
                ? "active"
                : "inactive underlineHover"
            }
          >
            <Link to="/signup">Sign Up</Link>
          </h2>

          <form onSubmit={handleSubmit} name={name}>
            <div className="loginentry">
              <input
                name="username"
                id="login"
                className="fadeIn second"
                placeholder={
                  window.location.pathname === "/signup" ? "Sign up" : "Login"
                }
                type="text"
              />
            </div>
            <div className="loginentry">
              <input
                name="password"
                id="password"
                className="fadeIn third"
                placeholder="password"
                type="password"
              />
            </div>
            <div className="loginentry">
              <button type="submit" className="fadeIn fourth">
                {displayName}
              </button>
            </div>

            {error && error.response && <div> {error.response.data} </div>}
          </form>
        </div>
        <div id="formFooter">
          <a className="underlineHover" href="#">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: "login",
    displayName: "Login",
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      dispatch(authenticate(username, password, formName));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
