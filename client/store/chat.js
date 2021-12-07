import axios from 'axios';
import socket from '../socket';
import { authenticateRequest } from './gateKeepingMiddleWare';

const TOKEN = 'token';
export const token = window.localStorage.getItem(TOKEN);
export const tokenHeader = {
  headers: {
    authorization: token,
  },
};

const GET_MESSAGES = 'GET_MESSAGES';
const GET_CHANNELS = 'GET_CHANNELS';
const ADD_CHANNEL = 'ADD_CHANNEL';
const GOT_MESSAGE = 'GOT_MESSAGE';

export const _addChannel = (newChannel) => ({
  type: ADD_CHANNEL,
  newChannel,
});

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

export const fetchMessages = () => async (dispatch) => {
  try {
    const { data: messages } = await axios.get(`/api/messages`);
    dispatch(getMessages(messages));
  } catch (err) {
    throw ('error something went wrong', err);
  }
};

export const addChannel = (channel, history) => async (dispatch) => {
  try {
    const newChannel = await authenticateRequest(
      'post',
      '/api/channels',
      channel
    );
    dispatch(_addChannel(newChannel));
    history.push(`/chat/channels/${newChannel.id}`);
  } catch (err) {
    console.error(error);
    next(err);
  }
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
    // dispatch(gotMessage(newMessage)); I think we can delete this. -sh
    socket.emit('new-message', { newMessage, channel: newMessage.channelId });
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
    case ADD_CHANNEL:
      return { ...state, channels: [...state.channels, action.newChannel] };
    case GET_CHANNELS:
      return { ...state, channels: action.channels };
    default:
      return state;
  }
};
