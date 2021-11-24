import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
const L = require("leaflet");
// const leafletMap = require("leaflet-map");

let myMap;

export const UserPage = (props) => {
  const [filter, setFilter] = useState("1");
  const [users, setUsers] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
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
      const { data } = await axios.get(`/api/users`);
      setUsers(data);

      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      setCoords([latitude, longitude]);

      myMap = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(myMap);

      const marker = L.marker([latitude, longitude]).addTo(myMap);
    }

    getLocation();
  }, []);

  function handleChange(event) {
    console.log(`state coords`, lat, lng);
    setFilter(event.target.value);

    const nearby = users.filter((person) => {
      console.log(
        (
          myMap.distance([lat, lng], [person.latitude, person.longitude]) / 1609
        ).toFixed(2)
      );
      return (
        (
          myMap.distance([lat, lng], [person.latitude, person.longitude]) / 1609
        ).toFixed(2) <= event.target.value
      );
    });

    nearby.map((person) => {
      console.log(
        `${person.username} is ` +
          (
            myMap.distance([lat, lng], [person.latitude, person.longitude]) /
            1609
          ).toFixed(2) +
          ` miles from Mehron`
      );
    });

    setNearbyUsers(nearby);
  }

  // useEffect(() => {
  //   console.log(`hi`);
  //   loadmap();
  // }, []);

  return (
    <div>
      <div>
        <select onChange={handleChange}>
          <option></option>
          <option value="1">1 Mile</option>
          <option value="5">5 Miles</option>
          <option value="10">10 Miles</option>
        </select>
      </div>
      <div id="map"></div>
      <div>
        {nearbyUsers.map((person) => {
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
