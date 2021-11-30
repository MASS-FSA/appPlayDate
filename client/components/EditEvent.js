import React, { useEffect, useState } from "react";

export default function EditEvent(props) {
  const [eventInfo, setEventInfo] = useState({
    name: "",
    location: "",
    time: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    setEventInfo((prevState) => {
      return {
        ...prevState,
        name: props.event.name,
        location: props.event.location,
        time: props.event.time.slice(0, 10),
        description: props.event.description || "",
        image: props.event.image,
      };
    });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setEventInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });

    console.log(eventInfo);
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
        <button>Submit</button>
      </form>
    </div>
  );
}
