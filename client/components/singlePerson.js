import React from "react";
import { Link } from "react-router-dom";

const SinglePerson = (props) => {
  const { id, username, image } = props.person;
  const toProfile = `/profile/${id}`;
  return (
    <Link to={toProfile}>
      <div className="filtercontainer">
        <p id="idname">{username}</p>
        <img id="personImg" src={image} />
      </div>
    </Link>
  );
};

export default SinglePerson;
