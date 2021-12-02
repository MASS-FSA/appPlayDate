import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Message from './Message';
import NewMessage from './NewMessage';

// I didn't use hooks here, not sure if we need to. -sh
export const Messages = (props) => {
  const channelId = Number(props.match.params.channelId);
  //We'll need to move this logic to the thunk and backend, but it renders for now. -sh
  const messages = props.messages;
  const filteredMessages = messages.filter(
    (message) => message.channelId === channelId
  );

  return (
    <div>
      <ul className='media-list'>
        {filteredMessages.map((message) => (
          <Message message={message} key={message.id} />
        ))}
      </ul>
      <NewMessage channelId={channelId} />
    </div>
  );
};

// We still need to write the component for NewMessage. -sh

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
});

export default connect(mapStateToProps)(Messages);
