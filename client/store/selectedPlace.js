//  ACTION CREATORS

const SET_SELECTED_PLACE = 'SET_SELECTED_PLACE'
const CLEAR_SELECTED_PLACE = 'CLEAR_SELECTED_PLACE'

//  ACTION CREATORS

export const setSelectedPlace = (place) => {
  return {
    type: SET_SELECTED_PLACE,
    place
  }
}

export const clearSelectedPlace = () => {
  return {
    type: CLEAR_SELECTED_PLACE
  }
}

//  INITIAL STATE

const initialState = {}

//  REDUCER

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_SELECTED_PLACE:
      return action.place
    case CLEAR_SELECTED_PLACE:
      return initialState
    default:
      return state
  }
}
