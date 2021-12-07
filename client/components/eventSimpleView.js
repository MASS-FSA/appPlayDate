import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

//  Gets its props passed in through map. Currently Used in places.js component
const EventSimpleView = (props) => {
  const {id, name, image, location, time} = props.event
  const goTo = `/events/${id}`
  return (
    <div>
      <h6>{name}</h6>
      <Link to={goTo}>
        <img src={image}/>
      </Link>
      <p>Where: {location}</p>
      <p>At: {time}</p>
    </div>
  )

}

export default EventSimpleView
