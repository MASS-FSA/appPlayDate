import axios from "axios";
import { authenticateRequest } from "./gateKeepingMiddleWare";

// ACTION TYPES
const SET_ALL_USERS = `SET_ALL_USERS`;
const SET_NEARBY_USERS = `SET_NEARBY_USERS`;
const SET_SINGLE_USER = `SET_SINGLE_USER`;
const SET_INTAKE = `SET_INTAKE`;
const SET_STATUS = `SET_STATUS`;
const SET_REQUESTS = `SET_REQUESTS`;
const SET_MY_FRIENDS = "SET_MY_FRIENDS";

// ACTION CREATORS
export const setAllUsers = (users) => {
  return {
    type: SET_ALL_USERS,
    allUsers: users,
  };
};

export const setMyFriends = (friends) => {
  return {
    type: SET_MY_FRIENDS,
    friends,
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

//  distance in KM
export const fetchUsersWithinDistance = (distance) => {
  return async (dispatch) => {
    try {
      const data = await authenticateRequest('get', `/api/users/nearby/distance/${distance}`)
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

export const updateSingleUser = (body) => {
  return async (dispatch) => {
    try {
      const data = await authenticateRequest('post', '/api/users', body)
      dispatch(setSingleUser(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const createUserIntake = (body) => {
  return async () => {
    try {
      await authenticateRequest('post', 'api/users/intakes', body)
    } catch (error) {
      console.error(error);
    }
  };
};

export const checkFriendStatus = (friendId) => {
  return async (dispatch) => {
    try {
      const data = authenticateRequest('get', `/api/friends/${friendId}`)
      dispatch(setStatus(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const sendFriendRequest = (friendId) => {
  return async (dispatch) => {
    try {
      const data = await authenticateRequest('post', `api/friends/${friendId}`)
      dispatch(setStatus(data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateFriendStatus = (friendId, response) => {
  const body = { status: response };
  return async (dispatch) => {
    try {
      await authenticateRequest('put', `api/friends/${friendId}`, body)
      // updated all friend requests with other thunk function
      if (response === `blocked`) dispatch(checkFriendStatus(userId, friendId));
      else dispatch(fetchFriendRequests());
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchMyFriends = () => async (dispatch) => {
  try {
    const data = await authenticateRequest('get', '/api/friends/');
    dispatch(setMyFriends(data));
  } catch (err) {
    console.error(err);
  }
};

export const fetchFriendRequests = () => {
  return async (dispatch) => {
    try {
      const data = await authenticateRequest('get', '/api/friends/requests')
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
    case SET_MY_FRIENDS:
      return { ...state, myFriends: action.friends };

    default:
      return state;
  }
};
