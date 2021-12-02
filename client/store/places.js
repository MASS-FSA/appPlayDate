import axios from "axios";


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

//  location should be an array with 2 floats. I.E [3.3422, -1.0033]
export const fetchPlaces = (location, radius) => async(dispatch) => {
  try {
    const locationToString = `${location[0]},${location[1]}`
    const {data} = await axios.get(`/api/places/${locationToString}/${radius}`)
    dispatch(getPlaces(data))
  } catch (err) {
    console.log('from fetch places', err)
  }
}

// Reducer

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLACES:
      return action.places
    default:
      return state
  }
}
