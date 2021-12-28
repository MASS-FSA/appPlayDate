import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createSingleEvent } from "../store/events";
import { clearSelectedPlace } from "../store/selectedPlace";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import history from "../history";

let provider;

const defaultUrl = `https://assets.rebelmouse.io/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8xODMwNzc2My9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTY3MTkzNTYwMX0.lHK0h7BhP9FgVrL0xNdfW9kyYEaCNRk8MLXzGv3VzVQ/img.jpg?width=1245&quality=85&coordinates=66%2C0%2C67%2C0&height=700`;

export const CreateEvent = (props) => {
  const [eventInfo, setEventInfo] = useState({
    name: "",
    location: "",
    time: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const { name, rating, types, vicinity } = props.selectedPlace;
    setEventInfo((prevEventInfo) => {
      return {
        ...prevEventInfo,
        name: name || "",
        location: vicinity || "",
        time: "",
        description: "",
        image: defaultUrl || "",
      };
    });
    // Geosearch with leaflet-geosearch
    if (!provider) provider = new OpenStreetMapProvider();

    return () => {
      props.clearSelectedPlace();
      window.localStorage.setItem("selectedPlace", {});
    };
  }, []);

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
      const [{ x, y }] = await parseAddress(body.location);
      body.latitude = y.toFixed(7);
      body.longitude = x.toFixed(7);
      body.createdBy = props.user.id;

      await props.createEvent(body, history);
    } catch (error) {
      console.error(error);
    }
  }

  async function parseAddress(address) {
    const results = await provider.search({ query: address });
    return results;
  }

  function handleClear() {
    setEventInfo((prevEventInfo) => {
      return {
        ...prevEventInfo,
        name: "",
        location: "",
        time: "",
        description: "",
        image: "",
      };
    });
  }

  return (
    <div className="questioncontainer">
      <div className="lines" />
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
        <label>Date</label>
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
        <img src={eventInfo.image} height="250px" />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(eventInfo);
          }}
        >
          Create This Event!
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleClear();
          }}
        >
          Clear All
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.events.singleEvent,
    selectedPlace: state.selectedPlace,
    user: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createEvent: (body, history) => dispatch(createSingleEvent(body, history)),
    clearSelectedPlace: () => dispatch(clearSelectedPlace()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
