import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux"

const SinglePlaceDetailedView = (props) => {
  const {name, icon, rating, types, vicinity} = props.selectedPlace || window.localStorage.selectedPlace

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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePlaceDetailedView)
