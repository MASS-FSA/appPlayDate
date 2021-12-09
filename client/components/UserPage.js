import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchMyFriends } from "../store/users";
import { fetchOwnedEvents, fetchParticipantIn } from "../store/events";
import { fetchOwnedChannels, fetchParticipantChannels } from "../store/chat";
import SinglePerson from "./singlePerson";
import LoadingSpinner from "./LoadingSpinner";
import EventSimpleView from "./eventSimpleView";

export const UserPage = (props) => {
  useEffect(() => {
    props.getFriends();
    props.fetchOwnedEvents();
    props.fetchOwnedChannels();
    props.fetchParticipantIn();
    props.fetchParticipantChannels();
  }, []);

  return (
    <div className="dashContainer">
      {/* FRIENDS */}
      <div className="userD">
        <h4 className="labelname">Friends</h4>
        {props.friends.length ? (
          props.friends.map((friend) => {
            return <SinglePerson key={friend.id} person={friend} />;
          })
        ) : (
          <p>Currently No Friends</p>
        )}
      </div>
      {/* EVENTS I MADE */}
      <div className="userD">
        <h4 className="labelname">Created By Me</h4>
        {props.myEvents.length ? (
          props.myEvents.map((event) => {
            return <EventSimpleView key={event.id} event={event} />;
          })
        ) : (
          <h4 className="labelname">Currently None</h4>
        )}
      </div>
      {/* EVENTS I AM PARTICIPATING IN */}
      <div className="userD">
        <h4 className="labelname">Events</h4>
        {props.participantIn.length ? (
          props.participantIn.map((event) => {
            return <EventSimpleView key={event.id} event={event} />;
          })
        ) : (
          <p>Currently None</p>
        )}
      </div>
      {/* CHANNELS I OWN */}
      {/* <div className="userD">
            <h4 className="labelname">My Chat Channels</h4>
            {props.ownedChannels.length ? (
              props.ownedChannels.map((channel) => {
                const goToChannel = `/chat/channels/${channel.id}`;
                return (
                  <div className="buttoncontainer" key={channel.id}>
                    <Link to={goToChannel}>
                      <button>{channel.name}</button>
                    </Link>
                  </div>
                );
              })
            ) : (
              <p>Currently None</p>
            )}
          </div> */}
      {/* CHANNELS I HAVE A CONVERSATION IN */}
      {/* <div className="userSdashboard">
            <h4>Continue A Conversation</h4>
            {props.participantChannels.length ? (
              props.participantChannels.map((channel) => {
                const goToChannel = `/chat/channels/${channel.id}`;
                return (
                  <div key={channel.id} className="buttoncontainer">
                    <Link to={goToChannel}>
                      <button>{channel.name}</button>
                    </Link>
                  </div>
                );
              })
            ) : (
              <Link to="/chat/channels">
                <button>Start Chatting With Other Parents!</button>
              </Link>
            )}
          </div> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    singleUser: state.auth,
    friends: state.users.myFriends,
    myEvents: state.events.myEvents,
    participantIn: state.events.participantIn,
    ownedChannels: state.chat.ownedChannels,
    participantChannels: state.chat.participantChannels,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFriends: () => dispatch(fetchMyFriends()),
    fetchOwnedEvents: () => dispatch(fetchOwnedEvents()),
    fetchParticipantIn: () => dispatch(fetchParticipantIn()),
    fetchOwnedChannels: () => dispatch(fetchOwnedChannels()),
    fetchParticipantChannels: () => dispatch(fetchParticipantChannels()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
