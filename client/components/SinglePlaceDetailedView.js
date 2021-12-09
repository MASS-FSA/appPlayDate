import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

let defaultParkImg = `https://previews.123rf.com/images/sashazerg/sashazerg1706/sashazerg170600034/80505918-park-and-playground-cartoon.jpg`;

const SinglePlaceDetailedView = (props) => {
  const { name, icon, rating, types, vicinity } =
    props.selectedPlace || window.localStorage.selectedPlace;

  return (
    <div className="placesingleContainer">
      <img src={defaultParkImg} width="100px" />
      <div className="attributescontainer">
        <p>{name}</p>
        <p>{vicinity}</p>
        <p>Rating: {rating}</p>
        <p>{types[0].slice(0, 1).toUpperCase() + types[0].slice(1)}</p>
      </div>
      <div className="eventscontainer">
        <Link to="/events/create">
          <button>Create Event</button>
        </Link>
      </div>
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
