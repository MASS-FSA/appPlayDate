import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchSingleEvent } from "../store/events";

const SingleEvent = (props) => {
  console.log(props);
  useEffect(() => {
    async function fetchEvent() {
      try {
        await props.getEvent(props.match.params.id);
      } catch (error) {
        console.error(error);
      }
    }

    fetchEvent();
  }, []);

  return (
    <div>
      <h1>{props.event.name}</h1>
      <h4>{props.event.description}</h4>
      <h4>{props.event.location}</h4>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.events.singleEvent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEvent: (id) => dispatch(fetchSingleEvent(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEvent);
