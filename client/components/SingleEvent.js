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
import { addChannel, getChannels } from "../store/chat";

// learn constant hook for this later
let provider;

const SingleEvent = (props) => {
  const [edit, setEdit] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [friendId, setFriendId] = useState(``);
  const [chatId, setChatId] = useState(``);

  useEffect(() => {
    function fetchData() {
      try {
        props.getEvent(props.match.params.id);
        props.getFriends();
        props.getChannels();
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

  useEffect(() => {
    if (props.channels !== []) {
      const names = props.channels.filter(
        (channel) => channel.name === props.event.name
      );
      if (names !== []) setChatId(names[0]?.id);
    }
  }, [props.channels]);

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
            <div className="rowbutton">
              <button onClick={(e) => handleEdit(e)}>Edit Event</button>
              <button type="button" onClick={() => handleDelete()}>
                Delete Event
              </button>
            </div>
          ) : null}
          <section className="rowbutton">
            <button
              onClick={(e) => {
                e.preventDefault();
                addFriend(props.user.id);
              }}
            >
              Join Event
            </button>

            {chatId ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  props.history.push(`/chat/channels/${chatId}`);
                }}
              >
                Join Chat
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  props.createChat({ name: props.event.name });
                }}
              >
                Create Chat
              </button>
            )}
          </section>
          <section>
            <select
              className="selectorx"
              onChange={(e) => handleChange(e)}
              value={friendId}
            >
              <option>Invite Friend</option>
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
            <br />
            <div className="rowbutton">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addFriend(friendId);
                }}
              >
                Add Friend
              </button>
            </div>
          </section>

          <img src={props.event.image} />
          <div className="singleeventcasing">
            <h1>{props.event.name}</h1>
            <h4>Description</h4>
            <h4>{props.event.description}</h4>
            <h4>{props.event.location}</h4>
            <h4>{props.event.time?.slice(0, 10)}</h4>
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
    channels: state.chat.channels,
  };
};

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    getEvent: (eventId) => dispatch(fetchSingleEvent(eventId)),
    deleteEvent: (id) => dispatch(deleteSingleEvent(id)),
    updateEvent: (id, body) => dispatch(updateSingleEvent(id, body)),
    getFriends: () => dispatch(fetchMyFriends()),
    addFriend: (eventId, targetId) => dispatch(addUserToEvent(eventId, targetId)),
    createChat: (channelName) => dispatch(addChannel(channelName, history)),
    getChannels: () => dispatch(getChannels()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEvent);
