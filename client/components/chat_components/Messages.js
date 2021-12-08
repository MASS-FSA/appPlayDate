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
  const filteredMessages = messages.filter(
    (message) => message.channelId === channelId
  );

  if (filteredMessages.length === 0) {
    return (
      <div className='message-container'>
        <ScrollToBottom className='message-container'>
          <h1>Be the first to write a message!</h1>
          <NewMessage channelId={channelId} />
        </ScrollToBottom>
      </div>
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
  channels: state.chat.channels,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: () => dispatch(fetchMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
