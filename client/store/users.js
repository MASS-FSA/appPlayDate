import axios from "axios";

// ACTION TYPES
const SET_ALL_USERS = `SET_ALL_USERS`;
const SET_NEARBY_USERS = `SET_NEARBY_USERS`;
const SET_SINGLE_USER = `SET_SINGLE_USER`;
const SET_INTAKE = `SET_INTAKE`;

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

// THUNKS

export const fetchdUsersWithinDistance = (userId, distance) => {
  const distanceObj = { distance };
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        `/api/users/nearby/${userId}`,
        distanceObj
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

const initialState = {
  allUsers: [],
  nearbyUsers: [],
  singleUser: {},
  intake: {},
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

    default:
      return state;
  }
};
