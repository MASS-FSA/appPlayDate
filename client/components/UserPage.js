import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchUsersWithinDistance, updateSingleUser } from '../store/users';
import { getGeoLocationFromBrowser } from '../../Util/loadMap';

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
      <div className='userSdashboard'>
        <select onChange={(e) => handleChange(e)}>
          <option></option>
          <option value='1'>1 Mile</option>
          <option value='5'>5 Miles</option>
          <option value='10'>10 Miles</option>
        </select>
      </div>
      {/* <div className="leafMap" id="map"></div> */}
      <div>
        {props.nearbyUsers
          .filter((person) => person.username !== props.singleUser.username)
          .map((person) => {
            return (
              <div
                key={person.id}
                className='nearby_users'
                onClick={() => props.history.push(`/profile/${person.id}`)}
              >
                <h3>{person.username}</h3>
                <img src={person.image} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    singleUser: state.auth,
    nearbyUsers: state.users.nearbyUsers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNearbyUsers: (userId, distance) =>
      dispatch(fetchUsersWithinDistance(userId, distance)),
    updateUser: (userId, coordsObj) =>
      dispatch(updateSingleUser(userId, coordsObj)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
