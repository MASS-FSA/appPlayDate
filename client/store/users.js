// ACTION TYPES
const SET_ALL_USERS = `SET_ALL_USERS`;

// ACTION CREATORS
export const setAllUsers = (users) => {
  return {
    type: SET_ALL_USERS,
    allUsers: users,
  };
};

const initialState = {
  allUsers: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_USERS:
      return { ...state, allUsers: action.users };

    default:
      return state;
  }
};
