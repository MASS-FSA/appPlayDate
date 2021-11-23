import React, { useEffect } from "react";
import { connect } from "react-redux";

// let myMap;

export const UserPage = (props) => {
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }

    function loadMap(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      console.log(latitude, longitude);

      const myMap = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(myMap);

      const marker = L.marker([latitude, longitude]).addTo(myMap);

      console.log(
        myMap.distance([latitude, longitude], [51.505, -0.09]) / 1700 + " miles"
      );
    }

    getLocation();
  }, []);

  // useEffect(() => {
  //   console.log(`hi`);
  //   loadmap();
  // }, []);

  return (
    <div>
      Hello
      <div id="map"></div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
