import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchAllEvents } from "../store/events";

const AllEvents = (props) => {
  useEffect(() => {
    async function fetchEvents() {
      try {
        await props.getAllEvents();
      } catch (error) {
        console.error(error);
      }
    }

    fetchEvents();
  }, []);

  console.log(props);
  return (
    <div>
      {props.allEvents.map((event) => {
        return (
          <fieldset
            key={event.id}
            onClick={() => props.history.push(`/events/${event.id}`)}
          >
            <legend>{event.name}</legend>
            <h4>Location: {event.location}</h4>
            <h4>Time: {event.time}</h4>
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
