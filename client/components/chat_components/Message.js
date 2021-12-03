import React from "react";

export default function Message(props) {
  const message = props.message;

  return (
    <li className="media">
      <div className="media-left">
        <img
          className="media-object"
          src={message.user?.image}
          alt="image"
          height="100px"
        />
      </div>
      <div className="media-body">
        <h4 className="media-heading">{message.user?.username}</h4>
        {message.content}
      </div>
    </li>
  );
}
