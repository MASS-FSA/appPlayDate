import React from "react";
import { Link } from "react-router-dom";

//  Gets its props passed in through map. Currently Used in places.js component
const EventSimpleView = (props) => {
  const { id, name, image, location, time } = props.event;
  const goTo = `/events/${id}`;
  return (
    <div className="filtercontainer">
      <Link to={goTo}>
        <p>{name}</p>
        <img id="personImg" src={image} />
        <p>Where: {location}</p>
        <p>Date: {time.slice(0, 10)}</p>
      </Link>
    </div>
  );
};

export default EventSimpleView;
