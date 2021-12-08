import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addUserToEvent,
  deleteSingleEvent,
  fetchSingleEvent,
  updateSingleEvent,
} from "../store/events";
import EditEvent from "./EditEvent";
import SinglePerson from "./singlePerson";
import { fetchMyFriends } from "../store/users";

import { OpenStreetMapProvider } from "leaflet-geosearch";
import { addChannel } from "../store/chat";

// learn constant hook for this later
let provider;

const SingleEvent = (props) => {
  const [edit, setEdit] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [friendId, setFriendId] = useState(``);

  useEffect(() => {
    async function fetchData() {
      try {
        await props.getEvent(props.match.params.id);
        await props.getFriends();
      } catch (error) {
        console.error(error);
      }
    }

    // Geosearch with leaflet-geosearch
    if (!provider) provider = new OpenStreetMapProvider();

    fetchData();
  }, []);

  useEffect(() => {
    if (props.event.users) {
      const usersId = props.event.users.map((user) => user.id);
      setExistingUsers(usersId);
    }
  }, [props.event]);

  function handleDelete() {
    props.deleteEvent(props.match.params.id);
    props.history.push(`/events`);
  }

  async function handleUpdate(body) {
    try {
      const [{ x, y }] = await parseAddress(body.location);
      body.latitude = y.toFixed(7);
      body.longitude = x.toFixed(7);

      await props.updateEvent(props.match.params.id, body);
      handleEdit();
    } catch (error) {
      console.error(error);
    }
  }

  async function parseAddress(address) {
    const results = await provider.search({ query: address });
    return results;
  }

  function handleEdit() {
    setEdit((prevEdit) => !prevEdit);
  }

  async function addFriend(userId) {
    if (!userId) return alert(`Please Select Friend`);
    try {
      await props.addFriend(props.event.id, userId);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event) {
    setFriendId(event.target.value);
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
        <div className="eventscontainer">
          {props.user.id === props.event.createdBy ? (
            <div>
              <button onClick={(e) => handleEdit(e)}>Edit</button>
              <button type="button" onClick={() => handleDelete()}>
                Delete
              </button>
            </div>
          ) : null}
          <button
            onClick={(e) => {
              e.preventDefault();
              addFriend(props.user.id);
            }}
          >
            Join Event
          </button>
          <select onChange={(e) => handleChange(e)} value={friendId}>
            <option>Add Friend To Event</option>
            {props.friends
              ?.filter((friend) => !existingUsers.includes(friend.id))
              .map((friend) => {
                return (
                  <option key={friend.id} value={friend.id}>
                    {friend.username}
                  </option>
                );
              })}
          </select>

          <button
            onClick={(e) => {
              e.preventDefault();
              addFriend(friendId);
            }}
          >
            Add Friend To Event
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              props.createChat({ name: props.event.name });
            }}
          >
            Create Event Chat
          </button>
          <img src={props.event.image} />
          <div className="singleeventcasing">
            <h1>{props.event.name}</h1>
            <h4>Description</h4>
            <h4>{props.event.description}</h4>
            <h4>{props.event.location}</h4>
          </div>
          <h4>People Attending Event</h4>
          <div className="event_people">
            {props.event.users?.map((person) => {
              return <SinglePerson key={person.id} person={person} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    event: state.events.singleEvent,
    user: state.auth,
    friends: state.users.myFriends,
  };
};

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    getEvent: (eventId) => dispatch(fetchSingleEvent(eventId)),
    deleteEvent: (id) => dispatch(deleteSingleEvent(id)),
    updateEvent: (id, body) => dispatch(updateSingleEvent(id, body)),
    getFriends: () => dispatch(fetchMyFriends()),
    addFriend: (eventId, userId) => dispatch(addUserToEvent(eventId, userId)),
    createChat: (channelName) => dispatch(addChannel(channelName, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEvent);
