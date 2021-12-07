import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getChannels, _setChannel, removeChannel } from '../../store/chat';
import { NavLink } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import socket from '../../socket';
import history from '../../history';

const Channel = (props) => {
  const [selectedChannel, setChannel] = useState(1)
  useEffect(() => {
    async function fetchData() {
      try {
        await props.getChannels();
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log('selectedChannel: ',selectedChannel)
  }, [selectedChannel])

  const handleClick = (id) => {
    socket.emit('join', id);
    setChannel(id)
  };

  return (
    <div className='dropdown-content'>
      <h1> Channels List </h1>
      {props.channels
        .sort((a, b) => a.id - b.id)
        .map((channel) => (
          <a key={channel.id}>
            <NavLink
              to={`/chat/channels/${channel.id}`}
              onClick={() => handleClick(channel.id)}
            >
              {channel.name.split('_').join(' ')}
            </NavLink>
          </a>
        ))}
      <button>
        <NavLink to='/channels/create'>Add New Channel</NavLink>
      </button>
      <button
        onClick={() => {
          console.log('This is my selected id: ', props.selected);
          props.removeChannel(selectedChannel, history);
        }}
      >
        Delete Channel
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    channels: state.chat.channels,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getChannels: () => dispatch(getChannels()),
  removeChannel: (id, history) => dispatch(removeChannel(id, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
