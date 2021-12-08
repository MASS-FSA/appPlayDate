import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

const Navbar = ({ handleClick, isLoggedIn, user }) => (
  <div className="Navbar">
    <h1>PLAYDATE</h1>
    <nav className="navContainer">
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}

          <Link to="/home">Home</Link>
          <Link to="/dash">{user.username}</Link>
          <Link to={`/myProfile/`}>My Profile</Link>
          <Link to="/events">View Events</Link>
          <Link to="/chat">Chat</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div className="Login_signupContainer">
          {/* The navbar will show these links before you log in */}
          <button>
            <Link to="/login">Login</Link>
          </button>
        </div>
      )}
    </nav>
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    user: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
