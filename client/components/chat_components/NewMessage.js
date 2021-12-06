import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../../store/chat';

function NewMessage(props) {
  // console.log('these are my newMessage Props: ', props);
  const [message, setMessage] = useState({
    content: '',
    // channelId: props.channelId,
  });
  const [channelId, setChannelId] = useState({
    channelId: props.channelId,
  });

  useEffect(() => {
    setChannelId(props.channelId);
  }, [props.channelId]);

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
    props.submitMessage({ content: message.content, channelId });
    setMessage((prevInfo) => {
      return {
        ...prevInfo,
        content: '',
      };
    });
  }

  return (
    <form id='new-message-form' onSubmit={handleSubmit}>
      <div className='input-group input-group-lg'>
        <input
          onChange={handleChange}
          className='form-control'
          type='text'
          name='content'
          placeholder='Say something nice...'
          value={message.content}
        />
        <span className='input-group-btn'>
          <button className='btn btn-default' type='submit'>
            Chat!
          </button>
        </span>
      </div>
    </form>
  );
}

const mapStateToProps = (state) => ({
  messages: state.chat.messages,
});

const mapDispatchToProps = (dispatch) => {
  return {
    submitMessage: (message) => dispatch(sendMessage(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMessage);
