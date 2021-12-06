import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { clearSelectedPlace } from "../store/selectedPlace";

const SinglePlaceDetailedView = (props) => {
  const {name, icon, rating, types, vicinity} = props.selectedPlace || window.localStorage.selectedPlace

  useEffect(()=> {
    return () => {
      props.clearSelectedPlace()
      window.localStorage.setItem("selectedPlace", {})
    }
  }, [])


  return (
    <div>
      <hr />
      <p>{name}</p>
      <p>{vicinity}</p>
      <p>{rating}</p>
      <p>{types}</p>
      <img src={icon}/>
      <Link to="/events/create">
        <button >Create An Event For This Venue!</button>
      </Link>
      <hr />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedPlace: state.selectedPlace
  }
}

const mapDispatchToProps = dispatch => {
  return {
  clearSelectedPlace: () => dispatch(clearSelectedPlace())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePlaceDetailedView)
