import React from 'react';

export default function Message(props) {
  const message = props.message;

  return (
    <div>
      <div className='sentmsgcontainer'>
      <div className='picturecontainer'>
        <img
          className='media-object'
          src={message.user.image}
          alt='image'
          height='40px'
          width='40px'
        />
         <h4 className='media-heading'>{message.user.username}</h4>
      </div>
      <div className='media-body'>{message.content}</div>
      </div>
    </div>
  );
}
