import axios from "axios";

// Action Types
const SET_ALL_EVENTS = "SET_ALL_EVENTS";
const SET_SINGLE_EVENT = "SET_SINGLE_EVENT";

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

export const fetchSingleEvent = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/events/${id}`);

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

// Reducer

const initialState = {
  allEvents: [],
  singleEvent: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_EVENTS:
      return { ...state, allEvents: action.events };
    case SET_SINGLE_EVENT:
      return { ...state, singleEvent: action.event };

    default:
      return state;
  }
};
