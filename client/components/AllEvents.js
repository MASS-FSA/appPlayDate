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
    <div>
      {props.allEvents
        .sort((a, b) => a.id - b.id)
        .map((event) => {
          return (
            <fieldset
              key={event.id}
              onClick={() => props.history.push(`/events/${event.id}`)}
            >
              <legend>{event.name}</legend>
              <img src={event.image} height="300px" />
              <h4>Location: {event.location}</h4>
              <h4>Time: {event.time}</h4>
              <p>{event.description}</p>
            </fieldset>
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
