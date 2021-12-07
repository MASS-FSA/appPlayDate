import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setSelectedPlace } from "../store/selectedPlace";

const singlePlace = (props) => {
  const { name, icon, rating, types, vicinity } = props.place;

  const handleClick = () => {
    localStorage.setItem("selectedPlace", props.place); // This is currently not working.
    props.setSelectedPlace(props.place);
  };

  return (
    <div className="filtercontainer" onClick={handleClick}>
      <Link to="/place/view">
        <p>{name}</p>
        <p>{vicinity}</p>
        <p>{rating}</p>
        {/* <p>{types}</p> */}
        <img src={icon} />
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedPlace: state.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedPlace: (place) => dispatch(setSelectedPlace(place)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(singlePlace);
