import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchMyFriends,
  fetchUsersWithinDistance,
  updateSingleUser,
} from "../store/users";
import { fetchOwnedEvents, fetchParticipantIn } from "../store/events";
import { fetchOwnedChannels, fetchParticipantChannels } from "../store/chat";
import { getGeoLocationFromBrowser } from "../../Util/loadMap";
import SinglePerson from "./singlePerson";
import LoadingSpinner from "./LoadingSpinner";
import EventSimpleView from "./eventSimpleView";

export const UserPage = (props) => {
  // const goToChannel = `/chat/channel/${}`
  const [coords, setCoords] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    seeFriends: true,
    seeEvents: true,
    seeOwnChannel: true,
    seePartChannel: true
  })

  useEffect(() => {
    // this is a callback to give position of user
    const call = (position) => {
      const point = [];
      point.push(position.coords.latitude);
      point.push(position.coords.longitude);
      setCoords(point);
    };
    // uses navigator method and uses `call` function as the callback
    getGeoLocationFromBrowser(call);
    props.getFriends();
    props.fetchOwnedEvents();
    props.fetchOwnedChannels();
    props.fetchParticipantIn();
    props.fetchParticipantChannels();
  }, []);

  useEffect(() => {
    function setCurrentPosition() {
      props.updateUser(props.singleUser.id, {
        latitude: coords[0],
        longitude: coords[1],
      });
    }
    setCurrentPosition();
    if (coords[0]) setLoading(false);
  }, [coords]);

  const handleHeader = (event) => {
    const val = event
    console.log(val)
    event.persist()
  }

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="dashContainer">
          {/* FRIENDS */}
<<<<<<< HEAD
          <div className="userSdashboard">
            <input type='button' name='friends' value='seeFriends'/>
            <h4 onClick={(e)=>handleHeader(e)} value="seeFriends">Friends</h4>
            {props.friends.length ?
              props.friends.map((friend) => {
=======
            <div className="userD">
              <h4 className="labelname">Friends</h4>
              {props.friends.length ? (
                props.friends.map((friend) => {
>>>>>>> main
                  return <SinglePerson key={friend.id} person={friend} />;
                })
              ) : (
                <p>Currently No Friends</p>
              )}
            </div>
          {/* EVENTS I MADE */}
          <div className="userD">
            <h4 className="labelname">Events I Made</h4>
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
            <h4 className="labelname">My Events</h4>
            {props.participantIn.length ? (
              props.participantIn.map((event) => {
                return <EventSimpleView key={event.id} event={event} />;
              })
            ) : (
              <p>Currently None</p>
            )}
          </div>
          {/* CHANNELS I OWN */}
          <div className="userD">
            <h4 className="labelname">My Chat Channels</h4>
            {props.ownedChannels.length ?
              (props.ownedChannels.map(channel => {
                const goToChannel = `/chat/channels/${channel.id}`
                  return <div className="buttoncontainer" key={channel.id}>
                    <Link to={goToChannel}>
                      <button>{channel.name}</button>
                    </Link>
                  </div>
              })
            ) : (
              <p>Currently None</p>
            )}
          </div>
          {/* CHANNELS I HAVE A CONVERSATION IN */}
         {/* <div className="userSdashboard">
            <h4>Continue A Conversation</h4>
            {props.participantChannels.length ?
              props.participantChannels.map(channel => {
                const goToChannel = `/chat/channels/${channel.id}`
                  return <div key={channel.id}>
                    <Link to={goToChannel}>
                      <button>{channel.name}</button>
                    </Link>
                  </div>
                })
            :
            <Link to="/chat/channels">
              <button>Start Chatting With Other Parents!</button>
            </Link>
            }
          </div>  */}
        </div>
      )}
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
    participantChannels: state.chat.participantChannels
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (userId, coordsObj) =>
      dispatch(updateSingleUser(userId, coordsObj)),
    getFriends: () => dispatch(fetchMyFriends()),
    fetchOwnedEvents: () => dispatch(fetchOwnedEvents()),
    fetchParticipantIn: () => dispatch(fetchParticipantIn()),
    fetchOwnedChannels: () => dispatch(fetchOwnedChannels()),
    fetchParticipantChannels: () => dispatch(fetchParticipantChannels())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
