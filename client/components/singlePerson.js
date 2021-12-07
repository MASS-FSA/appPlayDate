import React from "react";
import { Link } from "react-router-dom";

const SinglePerson = (props) => {
  const { id, username, image } = props.person;
  const toProfile = `profile/${id}`;
  return (
    <div>
      <br />
      <Link to={toProfile}>
        <hr />
        <p>{username}</p>
        <img src={image} className="single_user_img" />
        <hr />
      </Link>
    </div>
  );
};

export default SinglePerson;
