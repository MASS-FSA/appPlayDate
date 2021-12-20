import axios from "axios";

// Action Types

const GET_PLACES = "GET_PLACES";

// Action Creators

const getPlaces = (places) => {
  return {
    type: GET_PLACES,
    places,
  };
};

// Thunks

//  the input 'location' needs be an array with 2 floats. I.E [3.3422, -1.0033]. Radius is in KM and is optional
export const fetchPlaces = (location, radius) => async (dispatch) => {
  try {
    const locationToString = `${location[0]},${location[1]}`;
    //  data will be a pruned response form google places api recieved from out back end.
    const { data } = await axios.get(
      `/api/places/location/${locationToString}/radius/${radius}`
    );
    dispatch(getPlaces(data));
  } catch (err) {
    console.error(err);
  }
};

// Reducer

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLACES:
      return action.places;
    default:
      return state;
  }
};
