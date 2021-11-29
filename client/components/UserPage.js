import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

let myMap, latitude, longitude;

export const UserPage = (props) => {
  const [filter, setFilter] = useState("1");
  const [users, setUsers] = useState([]);

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

      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(latitude, longitude);

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
    setFilter(event.target.value);

    users
      .filter((person) => {
        console.log(event.target.value);
        return (
          (
            myMap.distance(
              [latitude, longitude],
              [person.latitude, person.longitude]
            ) / 1609
          ).toFixed(2) <= event.target.value
        );
      })
      .map((person) => {
        console.log(
          `${person.username} is ` +
            (
              myMap.distance(
                [latitude, longitude],
                [person.latitude, person.longitude]
              ) / 1609
            ).toFixed(2) +
            ` miles from Mehron`
        );
      });
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users.allUsers,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
