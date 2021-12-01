import axios from "axios";
// Google places api routes to use

// creates the url for the Google Places api.
// Location arg is an array with 2 floats [lat, long]


// Action Types

const GET_PLACES = "GET_PLACES";

// Action Creators

const getPlaces = (places) => {
  return {
    type: GET_PLACES,
    places,
  }
}

// Thunks

export const fetchPlaces = (location, radius) => async(dispatch) => {
  try {

  } catch (err) {
    console.log('from fetch places', err)
  }
}

// Reducer

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {


    default:
      return state
  }
}
