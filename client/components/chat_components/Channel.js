import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getChannels } from '../../store/chat';
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

  return (
    <div className='dropdown-content'>
      <h1> Channels List </h1>
      {props.channels
        .sort((a, b) => a.id - b.id)
        .map((channel) => (
          <a key={channel.id}>
            <NavLink
              to={`/chat/channels/${channel.id}`}
              onClick={() => socket.emit('join', channel.id)}
            >
              {channel.name.split('_').join(' ')}
            </NavLink>
          </a>
        ))}
      <button>
        <NavLink to='/channels/create'>Add New Channel</NavLink>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
