import axios from "axios";

// ACTION TYPES
const SET_ALL_USERS = `SET_ALL_USERS`;
const SET_NEARBY_USERS = `SET_NEARBY_USERS`;
const SET_SINGLE_USER = `SET_SINGLE_USER`;
const SET_INTAKE = `SET_INTAKE`;
const SET_STATUS = `SET_STATUS`;
const SET_REQUESTS = `SET_REQUESTS`;

// ACTION CREATORS
export const setAllUsers = (users) => {
  return {
    type: SET_ALL_USERS,
    allUsers: users,
  };
};

export const setNearbyUsers = (users) => {
  return {
    type: SET_NEARBY_USERS,
    users,
  };
};

export const setSingleUser = (user) => {
  return {
    type: SET_SINGLE_USER,
    user,
  };
};

export const setIntake = (intake) => {
  return {
    type: SET_INTAKE,
    intake,
  };
};

export const setStatus = (status) => {
  return {
    type: SET_STATUS,
    status,
  };
};

export const setRequests = (requests) => {
  return {
    type: SET_REQUESTS,
    requests,
  };
};

// THUNKS

export const fetchUsersWithinDistance = (userId, distance) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `/api/users/nearby/${userId}/${distance}`,
      );

      dispatch(setNearbyUsers(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchSingleUser = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateSingleUser = (userId, body) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`/api/users/${userId}`, body);
      dispatch(setSingleUser(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const createUserIntake = (userId, body) => {
  return async () => {
    try {
      await axios.post(`/api/users/intakes/${userId}`, body);
    } catch (error) {
      console.error(error);
    }
  };
};

export const checkFriendStatus = (userId, friendId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `/api/users/friends/${friendId}/${userId}`,
        {}
      );
      dispatch(setStatus(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const sendFriendRequest = (userId, friendId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        `/api/users/friends/${friendId}/${userId}`
      );
      dispatch(setStatus(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateFriendStatus = (userId, friendId, response) => {
  const body = { status: response };
  return async (dispatch) => {
    try {
      await axios.put(`/api/users/friends/${friendId}/${userId}`, body);
      // updated all friend requests with other thunk function
      if (response === `blocked`) dispatch(checkFriendStatus(userId, friendId));
      else dispatch(fetchFriendRequests(userId));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchFriendRequests = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/users/requests/${userId}`);
      dispatch(setRequests(data));
    } catch (error) {
      console.error(error);
    }
  };
};

const initialState = {
  allUsers: [],
  nearbyUsers: [],
  singleUser: {},
  intake: {},
  status: ``,
  requests: [],
  myFriends: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_USERS:
      return { ...state, allUsers: action.users };
    case SET_NEARBY_USERS:
      return { ...state, nearbyUsers: action.users };
    case SET_SINGLE_USER:
      return { ...state, singleUser: action.user };
    case SET_INTAKE:
      return { ...state, intake: action.intake };
    case SET_STATUS:
      return { ...state, status: action.status };
    case SET_REQUESTS:
      return { ...state, requests: action.requests };

    default:
      return state;
  }
};
