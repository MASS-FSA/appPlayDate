import React, { useEffect, useState } from "react";

//  Gets its props passed in through map. Currently Used in places.js component
const EventSimpleView = (props) => {
  const {name, image, location, time} = props.event

  return (
    <div>
      <h6>{name}</h6>
      <img src={image}/>
      <p>Where: {location}</p>
      <p>At: {time}</p>
    </div>
  )

}

export default EventSimpleView
