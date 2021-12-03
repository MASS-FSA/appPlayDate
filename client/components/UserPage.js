import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchdUsersWithinDistance } from "../store/users";
import { loadMap, getGeoLocationFromBrowser } from "../../Util/loadMap"
const L = require("leaflet");

export const UserPage = (props) => {

  const [[lat, lng], setCoords] = useState([null, null]);
  if (lat) {
    const myMap = loadMap('map', lat, lng)
    L.marker([lat, lng]).addTo(myMap);
  }

  useEffect(() => {
    const call = (position) => {
      const point = []
      point.push(position.coords.latitude)
      point.push(position.coords.longitude)
      setCoords(point)
    }
    getGeoLocationFromBrowser(call)
  }, []);

  async function handleChange(event) {
    const distance = event.target.value;
    try {
      let circle;
      await props.getNearbyUsers(props.singleUser.id, distance);

      if (circle) myMap.removeLayer(circle);
      circle = L.circle([lat, lng], {
        radius: distance * 1609,
      }).addTo(myMap);

      if (distance >= 10)
        myMap.flyTo([lat, lng], 11, {
          animate: true,
          pan: {
            duration: 2,
          },
        });
      else if (distance < 10 && distance >= 5)
        myMap.flyTo([lat, lng], 12, {
          animate: true,
          pan: {
            duration: 2,
          },
        });
      else
        myMap.flyTo([lat, lng], 13, {
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
              <div key={person.id} className="nearby_users">
                <img src={person.image} />
                <p>
                  {person.username} is{" "}
                  {(
                    myMap.distance(
                      [lat, lng],
                      [person.latitude, person.longitude]
                    ) / 1609
                  ).toFixed(2)}{" "}
                  miles from you
                </p>
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
