import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  fetchMyFriends,
  fetchUsersWithinDistance,
  updateSingleUser,
} from "../store/users";
import { getGeoLocationFromBrowser } from "../../Util/loadMap";
import SinglePerson from "./singlePerson";

export const UserPage = (props) => {
  const [coords, setCoords] = useState([null, null]);

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
  }, []);

  useEffect(() => {
    function setCurrentPosition() {
      props.updateUser(props.singleUser.id, {
        latitude: coords[0],
        longitude: coords[1],
      });
    }
    setCurrentPosition();
  }, [coords]);

  async function handleChange(event) {
    const distance = event.target.value;
    try {
      await props.getNearbyUsers(props.singleUser.id, distance);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="userSdashboard">
        <h4>Find Nearby Users</h4>
        <select onChange={(e) => handleChange(e)}>
          <option></option>
          <option value="1">1 Mile</option>
          <option value="5">5 Miles</option>
          <option value="10">10 Miles</option>
        </select>
      </div>
      <section>
        <h4>Friends</h4>
        {props.friends !== `none`
          ? props.friends?.map((friend) => {
              return <SinglePerson key={friend.id} person={friend} />;
            })
          : null}
      </section>
      <div>
        <h4>Nearby Users</h4>
        {props.nearbyUsers
          .filter((person) => person.username !== props.singleUser.username)
          .map((person) => {
            return <SinglePerson key={person.id} person={person} />;
          })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    singleUser: state.auth,
    nearbyUsers: state.users.nearbyUsers,
    friends: state.users.myFriends,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNearbyUsers: (userId, distance) =>
      dispatch(fetchUsersWithinDistance(userId, distance)),
    updateUser: (userId, coordsObj) =>
      dispatch(updateSingleUser(userId, coordsObj)),
    getFriends: () => dispatch(fetchMyFriends()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
