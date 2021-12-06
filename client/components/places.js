import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchPlaces } from "../store/places";
const L = require("leaflet");
import { getGeoLocationFromBrowser, loadMap } from "../../Util/loadMap";
import SinglePlaceView from "./singlePlace"

let myMap

const Places = (props) => {
  const [coords, setCoords] = useState([null, null]);
  // const [thisLocation, setThisLocation] = useState(true)
  const [options, setOptions] = useState({
    seePlaces: false,
    seePeople: false,
    seeFriends: false,
    seeEvents: false
  })


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
        return L.marker([
          place.lat,
          place.lng,
        ])
          .addTo(myMap)
          .bindPopup(`<p>${place.name}</p>`);
      });
    }
  }, [props.places]);

  // useEffect(() => {
  //   console.log('thislocation')
  //   if(thisLocation) {
  //     const call = (position) => {
  //       const point = [];
  //       point.push(position.coords.latitude);
  //       point.push(position.coords.longitude);
  //       setCoords(point);
  //     };
  //     // uses navigator method and uses `call` function as the callback
  //     getGeoLocationFromBrowser(call);
  //   } else {
  //     setCoords([props.me.latitude, props.me.longitude, 1600])
  //   }
  // }, [thisLocation])

  // function handleLocation() {
  //   setThisLocation(!thisLocation)
  // }

  function handleCheckBox(event) {
    if(event.target.value) {
      setOptions(prevOptions => {
        return {
          ...prevOptions,
          [event.target.value]: !options[event.target.value]
        }
      })
      event.persist()
    }
  }


  return (
    <div>
      {/* <div>
        <label htmlFor="chooseLocation">Use Location</label>
        <select name="locations" onChange={handleLocation}>
          <option value="myLocation">My Location</option>
          <option value="useHomeAddress">Use Home Address</option>
        </select>
      </div> */}
      <hr />
      <div className="leafMap" id="map" />
      <h2>Options</h2>
      <br />
      <div onClick={handleCheckBox}>
        <input type="checkbox" name="selectionOne" value="seePlaces" />
        <label htmlFor="seePlaces"> View Possible Meet Up<br /> Spots Near Me</label><br></br>

        <input type="checkbox" name="selectionTwo" value="seePeople" />
        <label htmlFor="seePeople"> View People Near Me</label><br></br>

        <input type="checkbox" name="selectionThree" value="seeFriends" />
        <label htmlFor="seeFriends"> View Friends</label><br></br>

        <input type="checkbox" name="selectionFour" value="seeEvents" />
        <label htmlFor="seeEvents"> View Events in My Area</label><br></br>
        <hr />
      </div>
      <div>
        {options.seePlaces ?
        props.places.map(place => (
          <SinglePlaceView key={place.name} place={place} />
        ))
        :
        null
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    places: state.places,
    me: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPlaces: (loc, radius) => dispatch(fetchPlaces(loc, radius)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Places);
