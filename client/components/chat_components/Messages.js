import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Message from './Message';
import NewMessage from './NewMessage';
import ScrollToBottom from "react-scroll-to-bottom"

// I didn't use hooks here, not sure if we need to. -sh
export const Messages = (props) => {
  const channelId = Number(props.match.params.channelId);
  //We'll need to move this logic to the thunk and backend, but it renders for now. -sh
  const messages = props.messages;
  const filteredMessages = messages.filter(
    (message) => message.channelId === channelId
  );

  return (
    <ScrollToBottom className="message-container">
    {
          filteredMessages.map((message) => {

          return<Message key={message.id}  message={message}/>}
          )
    }
    <NewMessage channelId={channelId} />
    </ScrollToBottom>
    

  );
};

// We still need to write the component for NewMessage. -sh

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
});

export default connect(mapStateToProps)(Messages);
