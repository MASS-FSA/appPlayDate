import React, { createRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchdUsersWithinDistance } from "../store/users";
import { loadMap, getGeoLocationFromBrowser } from "../../Util/loadMap";
const L = require("leaflet");

let myMap;

export const UserPage = (props) => {
  const [coords, setCoords] = useState([null, null]);

  useEffect(() => {
    console.log("places: ", props.places);
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
    if (!myMap && coords[0]) {
      console.log(`from coords`, coords);
      var myMap = loadMap("map", coords[0], coords[1]);
      L.marker([coords[0], coords[1]]).addTo(myMap).bindPopup("<p>YOU</p>");
    }
  }, [coords]);

  async function handleChange(event) {
    const distance = event.target.value;
    try {
      let circle;
      await props.getNearbyUsers(props.singleUser.id, distance);

      if (circle) myMap.removeLayer(circle);

      circle = L.circle([coords[0], coords[1]], {
        radius: distance * 1609,
      }).addTo(myMap);

      if (distance >= 10)
        myMap.flyTo([coords[0], coords[1]], 11, {
          animate: true,
          pan: {
            duration: 2,
          },
        });
      else if (distance < 10 && distance >= 5)
        myMap.flyTo([coords[0], coords[1]], 12, {
          animate: true,
          pan: {
            duration: 2,
          },
        });
      else
        myMap.flyTo([coords[0], coords[1]], 13, {
          animate: true,
          pan: {
            duration: 2,
          },
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div>
        <select onChange={(e) => handleChange(e)}>
          <option></option>
          <option value="1">1 Mile</option>
          <option value="5">5 Miles</option>
          <option value="10">10 Miles</option>
        </select>
      </div>
      <div className="leafMap" id="map"></div>
      <div>
        {props.nearbyUsers
          .filter((person) => person.username !== props.singleUser.username)
          .map((person) => {
            return (
              <div
                key={person.id}
                className="nearby_users"
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
      dispatch(fetchdUsersWithinDistance(userId, distance)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
