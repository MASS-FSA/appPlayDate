import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchPlaces } from '../store/places'
import monster from '../../Util/moster'
const L = require('leaflet')
import {getGeoLocationFromBrowser, loadMap} from '../../Util/loadMap'


const Places = (props) => {

  const [coords, setCoords] = useState([null, null]);
  const [map, setMap] = useState(null)

  useEffect(() => {
    console.log('places: ', props.places)
    const call = (position) => {
      console.log('position: ', position)
      const point = []
      point.push(position.coords.latitude)
      point.push(position.coords.longitude)
      setCoords(point)
    }
    getGeoLocationFromBrowser(call)
  }, [])

  useEffect(()=> {
    if (coords[0]) {
      props.fetchPlaces(coords, 16000)
      setMap( loadMap('mapForPlaces', coords[0], coords[1])   )
    }
    }, [coords])

  useEffect(()=> {
    if (map !== null) {
      console.log('map: ',map)
      console.log('places', props.places)
    }
  },[map])


  // useEffect(() => {
  //   return myMap.close()
  // },[])

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




