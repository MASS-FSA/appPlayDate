import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchdUsersWithinDistance } from "../store/users";
const L = require("leaflet");

let myMap;
let circle;

export const UserPage = (props) => {
  const [[lat, lng], setCoords] = useState([[]]);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }

    async function loadMap(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      setCoords([latitude, longitude]);

      myMap = L.map("map").setView([latitude, longitude], 12);

      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(myMap);

      const marker = L.marker([latitude, longitude]).addTo(myMap);
    }

    getLocation();
  }, []);

  async function handleChange(event) {
    console.log(`got here`);
    const distance = event.target.value;
    try {
      await props.getNearbyUsers(props.singleUser.id, distance);

      props.nearbyUsers.map((person) => {
        console.log(
          `${person.username} is ` +
            (
              myMap.distance([lat, lng], [person.latitude, person.longitude]) /
              1609
            ).toFixed(2) +
            ` miles from Mehron`
        );
      });

      if (circle) myMap.removeLayer(circle);
      circle = L.circle([lat, lng], {
        radius: distance * 1609,
      }).addTo(myMap);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(props);

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
      <div id="map"></div>
      <div>
        {props.nearbyUsers.map((person) => {
          return (
            <div key={person.id} className="nearby_users">
              <img src={person.image} />
              <h6>{person.username}</h6>
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
