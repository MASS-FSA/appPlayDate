import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMessages } from '../../store/chat';
import Message from './Message';
import NewMessage from './NewMessage';
import ScrollToBottom from 'react-scroll-to-bottom';
export const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function getData() {
      await props.getMessages();
    }
    getData();
  }, []);

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  const channelId = Number(props.match.params.channelId);
  // //We'll need to move this logic to the thunk and backend, but it renders for now. -sh
  const filteredMessages = messages.filter(
    (message) => message.channelId === channelId
  );

  if (filteredMessages.length === 0) {
    return (
      <ScrollToBottom className='message-container'>
        <h1>No Messages Here...</h1>
        <NewMessage channelId={channelId} />
      </ScrollToBottom>
    );
  } else {
    return (
      <ScrollToBottom className='message-container'>
        {filteredMessages
          .sort((a, b) => a.id - b.id)
          .map((message) => {
            return <Message key={message.id} message={message} />;
          })}
        <NewMessage channelId={channelId} />
      </ScrollToBottom>
    );
  }
};

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: () => dispatch(fetchMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
