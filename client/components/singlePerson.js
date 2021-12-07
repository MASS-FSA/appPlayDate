import React from "react";
import { Link } from "react-router-dom";

const SinglePerson = (props) => {
  const { id, username, image } = props.person;
  const toProfile = `profile/${id}`;
  return (
    <div className="filtercontainer">
      <Link to={toProfile}>
        <p id="idname">{username}</p>
        <img id="personImg" src={image} />
      </Link>
    </div>
  );
};

export default SinglePerson;
