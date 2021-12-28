import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchPlaces } from "../store/places";
import { fetchUsersWithinDistance } from "../store/users";
import { fetchMyFriends } from "../store/users";
import { fetchAllEvents, setSingleEvent } from "../store/events";
const L = require("leaflet");

import { getGeoLocationFromBrowser, loadMap } from "../../Util/loadMap";
import EventSimpleView from "./eventSimpleView";
import SinglePlaceView from "./singlePlace";
import SinglePerson from "./singlePerson";
import { setSelectedPlace } from "../store/selectedPlace";
import LoadingSpinner from "./LoadingSpinner";

let myMap;

const Places = (props) => {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState([]);
  const [options, setOptions] = useState({
    seePlaces: false,
    seePeople: false,
    seeFriends: false,
    seeEvents: false,
  });

  useEffect(() => {
    if (options.seeEvents) {
      props.events.map((event) => {
        return L.marker([event.latitude, event.longitude])
          .addTo(myMap)
          .bindPopup(
            L.popup({
              className: `openPopup`,
            })
          )
          .setPopupContent(`<p class="openPopup">${event.name}</p>`)
          .on(`popupopen`, () => {
            // direct click from popup to single place page
            document
              .querySelector(".openPopup")
              .addEventListener(`click`, (e) => {
                e.preventDefault();

                props.history.push(`/events/${event.id}`);
              });
          });
      });
      // const markers = L.markerClusterGroup();
      // const marker = L.marker(new L.LatLng(-84, 35));
      // markers.addLayer(marker);
      // myMap.addLayer(markers);
    } else if (myMap)
      myMap.eachLayer((layer) => {
        // prevents removal of map layout and `you are here` marker
        if (
          layer._latlng &&
          layer._latlng.lat !== coords[0] &&
          layer._latlng.lng !== coords[1]
        )
          layer.remove();
      });
  }, [options.seeEvents]);

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
    if (props.me.id) {
      props.fetchUsersWithinDistance(60000);
      props.fetchMyFriends();
      props.fetchAllEvents();
    }
  }, [props.me]);

  useEffect(() => {
    if (coords[0]) {
      props.fetchPlaces(coords, 16000);
      // this is the Util function, not leaflet map function
      myMap = loadMap("map", coords[0], coords[1]).setView(coords);

      const myIcon = L.icon({
        iconUrl: "here.png",
        iconSize: [30, 30],
        autoPan: true,
      });
      const marker = L.marker(coords, { icon: myIcon })
        .addTo(myMap)
        .bindPopup(
          L.popup({
            className: `openPopup`,
          })
        )
        .setPopupContent(`<p class="openPopup">You are here!</p>`)
        .openPopup();
    }
  }, [loading]);

  useEffect(() => {
    if (coords[0]) {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    if (props.places !== [] && options.seePlaces) {
      props.places.map((place) => {
        return L.marker([place.lat, place.lng])
          .addTo(myMap)
          .bindPopup(
            L.popup({
              className: `openPopup`,
            })
          )
          .setPopupContent(`<p class="openPopup">${place.name}</p>`)
          .on(`popupopen`, () => {
            // direct click from popup to single place page
            document
              .querySelector(".openPopup")
              .addEventListener(`click`, (e) => {
                e.preventDefault();

                handleSelectedPlace(place);
              });
          });
      });
    } else if (myMap)
      myMap.eachLayer((layer) => {
        // prevents removal of map layout and `you are here` marker
        if (
          layer._latlng &&
          layer._latlng.lat !== coords[0] &&
          layer._latlng.lng !== coords[1]
        )
          layer.remove();
      });
  }, [options.seePlaces]);

  async function handleSelectedPlace(place) {
    try {
      await props.setSelectedPlace(place);
      props.history.push(`place/view`);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCheckBox(event) {
    if (event.target.value) {
      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          [event.target.value]: !options[event.target.value],
        };
      });
      event.persist();
    }
  }

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="optionscontainer">
            <h2>☰Options</h2>
            <br />
            <div className="optionsdropdown" onClick={handleCheckBox}>
              <input type="checkbox" name="selectionOne" value="seePlaces" />
              <label htmlFor="seePlaces">
                {" "}
                View Possible Meet Up
                <br /> Spots Near Me
              </label>

              <input type="checkbox" name="selectionTwo" value="seePeople" />
              <label htmlFor="seePeople"> View People Near Me</label>

              <input type="checkbox" name="selectionThree" value="seeFriends" />
              <label htmlFor="seeFriends"> View Friends</label>

              <input type="checkbox" name="selectionFour" value="seeEvents" />
              <label htmlFor="seeEvents"> View Events in My Area</label>

              <hr />
            </div>
          </div>
          <div className="leafMap" id="map" />
          <h3 className="labelname">NEARBY PLACES</h3>
          <div className="bigfilterContainer">
            {/* FOR DISPALYING NEARBY PLACES */}
            {options.seePlaces ? (
              props.places.length ? (
                props.places.map((place) => (
                  <SinglePlaceView key={place.name} place={place} />
                ))
              ) : (
                <p>
                  No Places Found Near You. Let the Devs Know to increase the
                  search radius
                </p>
              )
            ) : null}
          </div>
          <h3 className="labelname">NEARBY PARENTS</h3>
          <div className="bigfilterContainer">
            {/* FOR DISPLAYING NEARBY PEOPLE */}
            {options.seePeople ? (
              props.people.length ? (
                props.people
                  .filter((person) => person.username !== props.me.username)
                  .map((person) => (
                    <SinglePerson key={person.id} person={person} />
                  ))
              ) : (
                <p>No People Near You Right Now. Please Try Again Later</p>
              )
            ) : null}
          </div>
          <h3 className="labelname">FRIENDS</h3>
          <div className="bigfilterContainer">
            {/* FOR DISPLAYING ALL FRIENDS */}
            {options.seeFriends ? (
              props.myFriends.length ? (
                props.myFriends.map((friend) => (
                  <SinglePerson key={friend.id} person={friend} />
                ))
              ) : (
                <p>Place Holder</p>
              )
            ) : null}
          </div>
          <h3 className="labelname">EVENTS</h3>
          <div className="bigfilterContainer">
            {/* FOR DISPLAYING EVENTS */}
            {options.seeEvents ? (
              props.events.length ? (
                props.events.map((event) => (
                  <EventSimpleView key={event.id} event={event} />
                ))
              ) : (
                <p>No Events Currently In Your Area</p>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    places: state.places,
    people: state.users.nearbyUsers,
    me: state.auth,
    myFriends: state.users.myFriends,
    events: state.events.allEvents,
    singleEvent: state.events.singleEvent,
    selectedPlace: state.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPlaces: (loc, radius) => dispatch(fetchPlaces(loc, radius)),
    fetchUsersWithinDistance: (distance) =>
      dispatch(fetchUsersWithinDistance(distance)),
    fetchMyFriends: () => dispatch(fetchMyFriends()),
    fetchAllEvents: () => dispatch(fetchAllEvents()),
    setSingleEvent: (event) => dispatch(setSingleEvent(event)),
    setSelectedPlace: (place) => dispatch(setSelectedPlace(place)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Places);
