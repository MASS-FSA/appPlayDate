import React from "react";
import { Link } from "react-router-dom";

export default function Message(props) {
  const message = props.message;

  return (
    <div className="bodymessage">
      <Link to={`/profile/${message.user.id}`}>
        <img className="media-object" src={message.user.image} alt="image" />
      </Link>
      <h4 className="media-heading">{message.user.username}</h4>
      <br />
      <div className="sentmsgcontainer">
        <div className="picturecontainer">
          <h4 className="media-body">{message.content}</h4>
        </div>
      </div>
    </div>
  );
}
