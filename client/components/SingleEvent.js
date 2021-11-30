import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { deleteSingleEvent, fetchSingleEvent } from "../store/events";
import EditEvent from "./EditEvent";

const SingleEvent = (props) => {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        await props.getEvent(props.match.params.id);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  function handleDelete() {
    props.deleteEvent(props.match.params.id);
    props.history.push(`/events`);
  }

  function handleEdit() {
    console.log(`click`);
    setEdit(true);
  }

  return (
    <div>
      {edit ? (
        <EditEvent event={props.event} />
      ) : (
        <div>
          <img src={props.event.image} height="300px" />
          <h1>{props.event.name}</h1>
          <h4>{props.event.description}</h4>
          <h4>{props.event.location}</h4>
          <button onClick={() => handleEdit()}>Edit</button>
          <button onClick={() => handleDelete()}>Delete</button>
        </div>
      )}
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
    deleteEvent: (id) => dispatch(deleteSingleEvent(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEvent);
