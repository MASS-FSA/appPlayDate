import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchPlaces } from "../store/places";
const L = require("leaflet");
import { getGeoLocationFromBrowser, loadMap } from "../../Util/loadMap";
import SinglePlaceView from "./singlePlace"

let myMap

const Places = (props) => {
  const [coords, setCoords] = useState([null, null]);


  useEffect(() => {
    console.log("places: ", props.places);
    // this is a callback to give position of user
    const call = (position) => {
      console.log("position: ", position);
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
      props.fetchPlaces(coords, 16000)
      myMap = loadMap("map", coords[0], coords[1]);
    }
  }, [coords]);

  useEffect(() => {
    if (props.palces !== []) {
      console.log(props.places);
      props.places.map((place) => {
        const marker = L.marker([
          place.lat,
          place.lng,
        ])
          .addTo(myMap)
          .bindPopup(`<p>${place.name}</p>`);

        return marker;
      });
    }
  }, [props.places]);

  return (
    <div>
      <div className="leafMap" id="map"></div>
      <div>
        {props.places.map(place => (
          <SinglePlaceView key={place.name} place={place} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    places: state.places,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPlaces: (loc, radius) => dispatch(fetchPlaces(loc, radius)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Places);
