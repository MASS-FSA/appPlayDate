import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMessages } from '../../store/chat';
import Message from './Message';
import NewMessage from './NewMessage';

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

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: () => dispatch(fetchMessages()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
