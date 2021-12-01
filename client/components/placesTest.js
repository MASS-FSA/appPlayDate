import React from 'react'
import monster from '../../Util/moster'
const L = require('leaflet')

let myMap

const loadMap = () => {
  myMap = L.map("map").setView([38.8125889, -77.18318725], 12);

  const googleView = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
  ).addTo(myMap);


  return myMap
}




class PlacesTest extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    loadMap()
    monster.map(location => {
      return L.marker([location.geometry.location.lat, location.geometry.location.lng]).addTo(myMap)
      })
  }

  render() {

    return (
      <div id="map">

      </div>
    )
  }
}

export default PlacesTest




