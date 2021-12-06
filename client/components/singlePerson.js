import React from 'react'

const SinglePerson = (props) => {
  const {username, image} = props.person

  return (
    <div>
      <hr />
      <p>{username}</p>
      <img src={image} />
      <hr />
    </div>
  )
}

export default SinglePerson
