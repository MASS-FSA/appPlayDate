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
      console.log(`got to map func`);
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      const mymap = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(mymap);
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
