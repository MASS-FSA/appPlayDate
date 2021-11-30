import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  deleteSingleEvent,
  fetchSingleEvent,
  updateSingleEvent,
} from "../store/events";
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

  async function handleUpdate(body) {
    await props.updateEvent(props.match.params.id, body);
    handleEdit();
  }

  function handleEdit() {
    setEdit((prevEdit) => !prevEdit);
  }

  return (
    <div>
      {edit ? (
        <EditEvent
          event={props.event}
          handleEdit={handleEdit}
          handleUpdate={handleUpdate}
        />
      ) : (
        <div>
          <img src={props.event.image} height="300px" />
          <h1>{props.event.name}</h1>
          <h4>{props.event.description}</h4>
          <h4>{props.event.location}</h4>
          <button onClick={(e) => handleEdit(e)}>Edit</button>
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
    updateEvent: (id, body) => dispatch(updateSingleEvent(id, body)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEvent);
