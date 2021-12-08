import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchMyFriends,
  fetchUsersWithinDistance,
  updateSingleUser,
} from "../store/users";
import { fetchOwnedEvents, fetchParticipantIn } from "../store/events";
import { fetchOwnedChannels } from "../store/chat";
import { getGeoLocationFromBrowser } from "../../Util/loadMap";
import SinglePerson from "./singlePerson";
import LoadingSpinner from "./LoadingSpinner";
import EventSimpleView from "./eventSimpleView";

export const UserPage = (props) => {
  // const goToChannel = `/chat/channel/${}`
  const [coords, setCoords] = useState([null, null]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="dashContainer">
          {/* FRIENDS */}
            <div >
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
          <div className="userSdashboard">
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
          <div className="userSdashboard">
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
          <div className="userSdashboard">
            <h4 className="labelname">My Chat Channels</h4>
            {props.ownedChannels.length ? (
              props.ownedChannels.map((channel) => {
                return (
                  <div key={channel.id}>
                    <div className="buttoncontainer">
                      <Link to="/chat/channels">
                        <button>{channel.name}</button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Currently None</p>
            )}
          </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
