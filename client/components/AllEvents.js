import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchAllEvents } from "../store/events";

const AllEvents = (props) => {
  useEffect(() => {
    async function fetchData() {
      try {
        await props.getAllEvents();
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="eventscontainer">
      <div className="rowbutton">
      <button
        onClick={(e) => {
          e.preventDefault();
          props.history.push(`events/create`);
        }}
      >
        Create Event
      </button>
      </div>
      {/* <select>
          <option> Today </option>
          <option> Weekend </option>
          <option> Near Me </option>
      </select> */}
      {props.allEvents
        .sort((a, b) => a.id - b.id)
        .map((event) => {
          return (
            <div key={event.id} className="singleEvent">
              <fieldset
              key={event.id}
              onClick={() => props.history.push(`/events/${event.id}`)}
            >
              <legend>{event.name}</legend>
              <img src={event.image}  />
              <h4>Location: {event.location}</h4>
              <h4>Time: {event.time.slice(0, 10)}</h4>
              <p>{event.description}</p>
            </fieldset>
            </div>
          );
        })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    allEvents: state.events.allEvents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllEvents: () => dispatch(fetchAllEvents()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllEvents);
