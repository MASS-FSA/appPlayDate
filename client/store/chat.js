import axios from 'axios';
import socket from '../socket';
// import io from 'socket.io-client';
// const socket = io(window.location.origin);

const TOKEN = 'token';
export const token = window.localStorage.getItem(TOKEN);
export const tokenHeader = {
  headers: {
    authorization: token,
  },
};

const GET_MESSAGES = 'GET_MESSAGES';
const GET_CHANNELS = 'GET_CHANNELS';
const GOT_MESSAGE = 'GOT_MESSAGE';

export const getMessages = (messages) => {
  return {
    type: GET_MESSAGES,
    messages,
  };
};
export const gotMessage = (newMessage) => {
  return {
    type: GOT_MESSAGE,
    newMessage,
  };
};
export const _getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

export const fetchMessages = () => {
  return async (dispatch) => {
    try {
      const { data: messages } = await axios.get(`/api/messages`);
      dispatch(getMessages(messages));
    } catch (err) {
      throw ('error something went wrong', err);
    }
  };
};

export const getChannels = () => async (dispatch) => {
  try {
    const { data: channels } = await axios.get('/api/channels');
    dispatch(_getChannels(channels));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendMessage = (message) => async (dispatch) => {
  try {
    const { data: newMessage } = await axios.post(
      '/api/messages',
      message,
      tokenHeader
    );
    dispatch(gotMessage(newMessage));
    socket.emit('new-message', newMessage);
  } catch (error) {
    console.error(error);
  }
};

const initialState = {
  messages: [],
  channels: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return { ...state, messages: action.messages };
    case GOT_MESSAGE:
      return { ...state, messages: [...state.messages, action.newMessage] };
    case GET_CHANNELS:
      return { ...state, channels: action.channels };
    default:
      return state;
  }
};
