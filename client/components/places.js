import React, { useEffect, useState } from 'react'
import monster from '../../Util/moster'
const L = require('leaflet')
import {getGeoLocationFromBrowser, loadMap} from '../../Util/loadMap'


const Places = (props) => {
  const [[lat, lng], setCoords] = useState([null, null]);
  if (lat) {
    const myMap = loadMap('mapForPlaces', lat, lng)
    L.marker([lat, lng]).addTo(myMap);
    // monster.map(location => {
    //   return L.marker([location.geometry.location.lat, location.geometry.location.lng]).addTo(myMap)
    // })
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


  return (
    <div>
      <div className="leafMap" id="mapForPlaces">
      </div>
    </div>
  )
}

export default Places




