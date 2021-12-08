import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  fetchMyFriends,
  fetchUsersWithinDistance,
  updateSingleUser,
} from "../store/users";
import { getGeoLocationFromBrowser } from "../../Util/loadMap";
import SinglePerson from "./singlePerson";
import LoadingSpinner from "./LoadingSpinner";

export const UserPage = (props) => {
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
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="userSdashboard">
            <h4>Friends</h4>
            {props.friends.length ?
              props.friends.map((friend) => {
                  return <SinglePerson key={friend.id} person={friend} />;
                })
            :
            <p>Currently No Friends</p>}
          </div>
        </div>
      )}
    </div>
  )
}

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
