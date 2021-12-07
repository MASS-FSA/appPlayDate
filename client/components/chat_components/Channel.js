import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getChannels, _setChannel, removeChannel } from '../../store/chat';
import { NavLink } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import socket from '../../socket';

const Channel = (props) => {
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

  const handleClick = (id) => {
    // console.log(id);
    socket.emit('join', id);
    props._setChannel(id);
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
              onClick={handleClick(channel.id)}
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
          console.log('This is my selected id: ', props.selected.id);
          // props.removeChannel(props.selected.id);
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
    selected: state.chat.selectedChannel,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getChannels: () => dispatch(getChannels()),
  _setChannel: (id) => dispatch(_setChannel(id)),
  removeChannel: (id) => dispatch(removeChannel(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
