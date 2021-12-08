import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { fetchMessages } from "../store/chat";
import Channel from "./chat_components/Channel";
import Messages from "./chat_components/Messages";

const Chat = (props) => {
  const [messages, setMessages] = useState(props);

  useEffect(() => {
    async function callmessages() {
      try {
        await props.getMessages();
      } catch (error) {
        throw error;
      }
    }
    callmessages();
  }, []);

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  const channelId = Number(props.location.pathname.slice(-1));
  const channel = props.channels.filter((channel) => {
    return channel.id === channelId;
  });

  return (
    <div className="chatcontainer">
      <h1>{channel[0]?.name.split("_").join(" ")}</h1>
      <div className="ChatParent">
        <div className="Chat">
          <div className="channel">
            ☰<Channel />
          </div>
          <Route path="/chat/channels/:channelId" component={Messages} />
          <div className="newmessage"></div>
        </div>
      </div>
      <div>
        <img id="MASSMasscot" src="trasparentdino.png" />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    messages: state.chat.messages,
    channels: state.chat.channels,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: () => dispatch(fetchMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
