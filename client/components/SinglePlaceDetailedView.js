import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

let defaultParkImg = `https://previews.123rf.com/images/sashazerg/sashazerg1706/sashazerg170600034/80505918-park-and-playground-cartoon.jpg`;

const SinglePlaceDetailedView = (props) => {
  const { name, icon, rating, types, vicinity } =
    props.selectedPlace || window.localStorage.selectedPlace;

  return (
    <div>
      <hr />
      <p>{name}</p>
      <p>{vicinity}</p>
      <p>{rating}</p>
      <p>{types}</p>
      <img src={defaultParkImg} width="100px" />
      <Link to="/events/create">
        <button>Create An Event For This Venue!</button>
      </Link>
      <hr />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedPlace: state.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SinglePlaceDetailedView);
