import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchPlaces } from '../store/places'
import monster from '../../Util/moster'
const L = require('leaflet')
import {getGeoLocationFromBrowser, loadMap} from '../../Util/loadMap'


const Places = (props) => {
  const [[lat, lng], setCoords] = useState([null, null]);
  useEffect(() => {
    if (lat) {
      var myMap = loadMap('mapForPlaces', lat, lng)
      L.marker([lat, lng]).addTo(myMap);
      // console.log('places: ', props.places)
    }
    // if (myMap) {
    //   console.log('map off')
    //   myMap.off()
    //   myMap.remove()
    // }
    props.fetchPlaces([lat, lng], 16000)

  })

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




