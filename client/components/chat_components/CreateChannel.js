import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addChannel } from '../../store/chat';

export const CreateChannel = (props) => {
  const [channelInfo, setChannelInfo] = useState({
    name: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setChannelInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  }

  async function handleSubmit(body) {
    try {
      await props.createChannel(body);
    } catch (error) {
      console.error(error);
    }
  }
  console.log('Create Channel Props: ', props);

  return (
    <div className='questioncontainer'>
      <div className='lines' />
      <form>
        <label>Name:</label>
        <input name='name' value={channelInfo.name} onChange={handleChange} />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(channelInfo);
          }}
        >
          Add Channel
        </button>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    createChannel: (body) => dispatch(addChannel(body, history)),
  };
};

export default connect(null, mapDispatchToProps)(CreateChannel);
