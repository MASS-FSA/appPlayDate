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
    <div>
      <h1> Channels List </h1>
      <ul>
        {props.channels.map((channel) => (
          <li key={channel.id}>
            <NavLink
              to={`/chat/channels/${channel.id}`}
              onClick={() => socket.emit('join', channel.id)}
            >
              {channel.name}
            </NavLink>
          </li>
        ))}
      </ul>
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
