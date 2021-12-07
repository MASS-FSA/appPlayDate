import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchPlaces } from "../store/places";
import { fetchUsersWithinDistance } from "../store/users";
import { fetchMyFriends } from "../store/users";
import { fetchAllEvents, setSingleEvent } from "../store/events";
const L = require("leaflet");
import { getGeoLocationFromBrowser, loadMap } from "../../Util/loadMap";
import EventSimpleView from "./eventSimpleView";
import SinglePlaceView from "./singlePlace"
import SinglePerson from "./singlePerson"

let myMap

const Places = (props) => {
  const [coords, setCoords] = useState([null, null]);
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

  useEffect(()=>{
    if (props.me.id) {
      props.fetchUsersWithinDistance(props.me.id, 60000)
      props.fetchMyFriends()
      props.fetchAllEvents()
    }
  }, [props.me])

  useEffect(() => {
    if (!myMap && coords[0]) {
      props.fetchPlaces(coords, 16000)
      myMap = loadMap("map", coords[0], coords[1]);
    }
  }, [coords]);

  useEffect(() => {
    if (props.palces !== []) {
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
        {/* FOR DISPALYING NEARBY PLACES */}
        <h3>NEARBY PLACES</h3>
        {options.seePlaces ?
          (props.places.length ?
            props.places.map(place => (
              <SinglePlaceView key={place.name} place={place} />
            ))
            :
            <p>No Places Found Near You. Let the Devs Know to increase the search radius</p>
          )
          :
          null
        }
      </div>
      <div>
        {/* FOR DISPLAYING NEARBY PEOPLE */}
        <h3>NEARBY PARENTS</h3>
        {options.seePeople ?
          (props.people.length ?
            props.people.map(person => (
              <SinglePerson key={person.id} person={person}/>
            ))
            :
            <p>No People Near You Right Now. Please Try Again Later</p>
          )
          :
          null
        }
      </div>
      <div>
        {/* FOR DISPLAYING ALL FRIENDS */}
        <h3>FRIENDS</h3>
        {options.seeFriends ?
           props.myFriends.length ?
            props.myFriends.map(friend => (
              <SinglePerson key={friend.id} person={friend}/>
            ))
            :
            <p>Place Holder</p>
          :
          null
        }
      </div>
      <div>
        {/* FOR DISPLAYING EVENTS */}
        <h3>EVENTS</h3>
        {options.seeEvents ?
          props.events.length ?
            props.events.map(event => (
              <EventSimpleView key={event.id} event={event}/>
            ))
            :
            <p>No Events Currently In Your Area</p>
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
    people: state.users.nearbyUsers,
    me: state.auth,
    myFriends: state.users.myFriends,
    events: state.events.allEvents,
    singleEvent: state.events.singleEvent
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPlaces: (loc, radius) => dispatch(fetchPlaces(loc, radius)),
    fetchUsersWithinDistance: (id, distance) =>  dispatch(fetchUsersWithinDistance(id, distance)),
    fetchMyFriends: () => dispatch(fetchMyFriends()),
    fetchAllEvents: () => dispatch(fetchAllEvents()),
    setSingleEvent: (event) => dispatch(setSingleEvent(event))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Places);
