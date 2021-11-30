import React, { useState } from "react";
import { connect } from "react-redux";
import { createSingleEvent } from "../store/events";

const defaultUrl = `https://assets.rebelmouse.io/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8xODMwNzc2My9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTY3MTkzNTYwMX0.lHK0h7BhP9FgVrL0xNdfW9kyYEaCNRk8MLXzGv3VzVQ/img.jpg?width=1245&quality=85&coordinates=66%2C0%2C67%2C0&height=700`;

export const CreateEvent = (props) => {
  const [eventInfo, setEventInfo] = useState({
    name: "",
    location: "",
    time: "",
    description: "",
    image: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setEventInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  }

  async function handleSubmit(body) {
    try {
      if (body.image === "") body.image = defaultUrl;
      if (body.time === "") return alert("Select Time");
      await props.createEvent(body);

      // setTimeout(() => {
      //   props.history.push(`/events/${props.event.id}`);
      // }, 300);

      // console.log(props.singleEvent.id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <form>
        <label>Name</label>
        <input name="name" value={eventInfo.name} onChange={handleChange} />
        <br />
        <label>Location</label>
        <input
          name="location"
          value={eventInfo.location}
          onChange={handleChange}
        />
        <br />
        <label>Time</label>
        <input
          type="date"
          name="time"
          value={eventInfo.time}
          onChange={handleChange}
        />
        <br />
        <label>Description</label>
        <textarea
          name="description"
          value={eventInfo.description}
          onChange={handleChange}
        />
        <br />
        <label>Image</label>
        <input name="image" value={eventInfo.image} onChange={handleChange} />
        <br />
        <img src={eventInfo.image} height="300px" />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(eventInfo);
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.events.singleEvent,
  };
};

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    createEvent: (body) => dispatch(createSingleEvent(body, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);