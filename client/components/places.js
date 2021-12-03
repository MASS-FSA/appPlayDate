import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchPlaces } from '../store/places'
import monster from '../../Util/moster'
const L = require('leaflet')
import {getGeoLocationFromBrowser, loadMap} from '../../Util/loadMap'


const Places = (props) => {

  const [[lat, lng], setCoords] = useState([null, null]);
  const [myMap, setMap] = useState({})
  if(lat) {
    const myMap = loadMap('mapForPlaces', lat, lng)
    console.log('myMap: ', myMap)
    L.marker([lat, lng]).addTo(myMap);
  }
  useEffect(() => {
    const call = (position) => {
      console.log('position: ', position)
      const point = []
      point.push(position.coords.latitude)
      point.push(position.coords.longitude)
      setCoords(point)
    }
    getGeoLocationFromBrowser(call)
    console.log('lat long: ', lat, lng)

  }, [])


  return (
    <div>
      <div className="leafMap" id="mapForPlaces">
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    places: state.places
  }
}

const mapDispatchToProps= (dispatch) => {
  return {
    fetchPlaces: (loc, radius) => dispatch(fetchPlaces(loc, radius))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Places)




