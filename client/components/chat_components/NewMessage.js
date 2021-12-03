import React, { useState } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../../store/chat";
const socket = io(window.location.origin);
import io from "socket.io-client";

function NewMessage(props) {
  const [message, setMessage] = useState({
    content: "",
    channelId: props.channelId,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setMessage((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.submitMessage(message);
    socket.emit("new-message", message);

    setMessage((prevInfo) => {
      return {
        ...prevInfo,
        content: "",
      };
    });
  }

  // socket.removeAllListeners();
  socket.on(`new-message`, async (message) => {
    console.log(`yo`, message);
    // props.submitMessage(message);
    await props.getMessages();
  });

  return (
    <form id="new-message-form" onSubmit={handleSubmit}>
      <div className="input-group input-group-lg">
        <input
          onChange={handleChange}
          className="form-control"
          type="text"
          name="content"
          placeholder="Say something nice..."
          value={message.content}
        />
        <span className="input-group-btn">
          <button className="btn btn-default" type="submit">
            Chat!
          </button>
        </span>
      </div>
    </form>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitMessage: (message) => dispatch(sendMessage(message)),
  };
};

export default connect(null, mapDispatchToProps)(NewMessage);
