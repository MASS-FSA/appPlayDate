import React, { useState } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../../store/chat';

function NewMessage(props) {
  const [message, setMessage] = useState({
    content: '',
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
    setMessage((prevInfo) => {
      return {
        ...prevInfo,
        content: '',
      };
    });
  }

  return (
    <form id='new-message-form' onSubmit={handleSubmit}>
      <div className='inputcontainer'>
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
          <h1>CHAT</h1>
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
