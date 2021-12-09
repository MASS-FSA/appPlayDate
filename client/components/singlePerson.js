import React from "react";
import { Link } from "react-router-dom";

const SinglePerson = (props) => {
  const { id, username, image } = props.person;
  const toProfile = `/profile/${id}`;
  return (
      <Link className="filtercontainer" to={toProfile}>
         <>
          <p id="idname">{username}</p>
          <img id="personImg" src={image} />
         </> 
      </Link>
  );
};

export default SinglePerson;
