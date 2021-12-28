import axios from "axios";
import { authenticateRequest } from "./gateKeepingMiddleWare";

// Action Types
const SET_ALL_EVENTS = "SET_ALL_EVENTS";
const SET_SINGLE_EVENT = "SET_SINGLE_EVENT";
const SET_OWNED_EVENTS = "SET_OWNED_EVENTS";
const SET_PARTICIPANT_IN = "SET_PARTICIPANT_IN";

// Action Creators
export const setAllEvents = (events) => {
  return {
    type: SET_ALL_EVENTS,
    events,
  };
};

export const setSingleEvent = (event) => {
  return {
    type: SET_SINGLE_EVENT,
    event,
  };
};

const setOwnedEvents = (events) => {
  return {
    type: SET_OWNED_EVENTS,
    events,
  };
};

const setParticipantIn = (events) => {
  return {
    type: SET_PARTICIPANT_IN,
    events,
  };
};

// Thunks

export const fetchAllEvents = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/events`);
      dispatch(setAllEvents(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchOwnedEvents = () => async (dispatch) => {
  try {
    const data = await authenticateRequest("get", "/api/events/myevents");
    dispatch(setOwnedEvents(data));
  } catch (err) {
    console.error(err);
  }
};

export const fetchParticipantIn = () => async (dispatch) => {
  try {
    const data = await authenticateRequest("get", "/api/events/participating");
    dispatch(setParticipantIn(data));
  } catch (err) {
    console.error(err);
  }
};

export const fetchSingleEvent = (eventId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/events/${eventId}`);
      dispatch(setSingleEvent(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteSingleEvent = (id) => {
  return async () => {
    try {
      await axios.delete(`/api/events/${id}`);
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateSingleEvent = (id, body) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(`/api/events/${id}`, body);
      dispatch(setSingleEvent(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const createSingleEvent = (body, history) => {
  return async () => {
    try {
      const data = await authenticateRequest("post", "/api/events", body);
      history.push(`/events/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };
};

export const addUserToEvent = (eventId, targetId) => {
  return async (dispatch) => {
    try {
      console.log(targetId)
      const body = {targetId: targetId}
      const { data } = await axios.put(`/api/userEvents/${eventId}`, body);
      dispatch(setSingleEvent(data));
    } catch (error) {
      console.error(error);
    }
  };
};

// Reducer

const initialState = {
  allEvents: [],
  myEvents: [],
  participantIn: [],
  singleEvent: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_EVENTS:
      return { ...state, allEvents: action.events };
    case SET_SINGLE_EVENT:
      return { ...state, singleEvent: action.event };
    case SET_OWNED_EVENTS:
      return { ...state, myEvents: action.events };
    case SET_PARTICIPANT_IN:
      return { ...state, participantIn: action.events };
    default:
      return state;
  }
};
