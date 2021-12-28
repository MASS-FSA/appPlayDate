import axios from "axios";
import socket from "../socket";
import { authenticateRequest } from "./gateKeepingMiddleWare";

const TOKEN = "token";
export const token = window.localStorage.getItem(TOKEN);
export const tokenHeader = {
  headers: {
    authorization: token,
  },
};

const GET_MESSAGES = "GET_MESSAGES";
const GET_CHANNELS = "GET_CHANNELS";
const GET_OWNED_CHANNELS = "GET_OWNED_CHANNELS";
const GET_PARTICIPANT_CHANNELS = "GET_PARTICIPANT_CHANNELS";
const ADD_CHANNEL = "ADD_CHANNEL";
const GOT_MESSAGE = "GOT_MESSAGE";
const REMOVE_CHANNEL = "REMOVE_CHANNEL";

export const _addChannel = (newChannel) => ({
  type: ADD_CHANNEL,
  newChannel,
});
export const _removeChannel = (id) => ({
  type: REMOVE_CHANNEL,
  id,
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

const getOwnedChannels = (channels) => {
  return {
    type: GET_OWNED_CHANNELS,
    channels,
  };
};

const getParticipantChannels = (channels) => {
  return {
    type: GET_PARTICIPANT_CHANNELS,
    channels,
  };
};

export const fetchOwnedChannels = () => async (dispatch) => {
  try {
    const data = await authenticateRequest("get", "/api/channels/owned");
    dispatch(getOwnedChannels(data));
  } catch (err) {}
};

export const fetchParticipantChannels = () => async (dispatch) => {
  try {
    const data = await authenticateRequest(
      "get",
      "api/messages/channels/participant"
    );
    dispatch(getParticipantChannels(data));
  } catch (err) {
    console.error(err);
  }
};

export const fetchMessages = () => async (dispatch) => {
  try {
    const { data: messages } = await axios.get(`/api/messages/`);
    dispatch(getMessages(messages));
  } catch (err) {
    throw ("error something went wrong", err);
  }
};

export const addChannel = (channel, history) => async (dispatch) => {
  try {
    const newChannel = await authenticateRequest(
      "post",
      "/api/channels",
      channel
    );
    dispatch(_addChannel(newChannel));
    history.push(`/chat/channels/${newChannel.id}`);
  } catch (err) {
    console.error(error);
    next(err);
  }
};
export const removeChannel = (id, history) => async (dispatch) => {
  try {
    await authenticateRequest("delete", `/api/channels/${id}`);
    dispatch(_removeChannel(id));
    history.push(`/chat/channels/${1}`);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getChannels = () => async (dispatch) => {
  try {
    const { data: channels } = await axios.get("/api/channels");
    dispatch(_getChannels(channels));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendMessage = (message) => async (dispatch) => {
  try {
    const newMessage = await authenticateRequest(
      `post`,
      `/api/messages`,
      message
    );
    socket.emit("new-message", { newMessage, channel: newMessage.channelId });
  } catch (error) {
    console.error(error);
  }
};

const initialState = {
  messages: [],
  channels: [],
  ownedChannels: [],
  participantChannels: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return { ...state, messages: action.messages };
    case GOT_MESSAGE:
      return { ...state, messages: [...state.messages, action.newMessage] };
    case ADD_CHANNEL:
      return { ...state, channels: [...state.channels, action.newChannel] };
    case REMOVE_CHANNEL:
      return {
        ...state,
        channels: state.channels.filter((channel) => channel.id !== action.id),
      };
    case GET_CHANNELS:
      return { ...state, channels: action.channels };
    case GET_OWNED_CHANNELS:
      return { ...state, ownedChannels: action.channels };
    case GET_PARTICIPANT_CHANNELS:
      return { ...state, participantChannels: action.channels };
    default:
      return state;
  }
};
