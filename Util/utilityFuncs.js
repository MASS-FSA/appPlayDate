
//  location is a string arg 'lat,long' Must have the comma in between
const createPlacesApiUrl = (location, radius = 16000 ) => {
  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&max_price=0&type=park&key=AIzaSyD2V3SJD0Kkd7dy3e2R9X5agW6vNrQbl5w`
}

//  find the midpoint of 2 lats, longs
/**
 * Returns the exact longitude and latitudes halfway between two
 * latitude/longitude pairs on the globe. Note that this "closest"
 * point, to two other points may sometimes cross over the north or
 * south pole.
 * @param {!number} latitude1 The latitude of the first point (in degress).
 * @param {!number} longitude1 The longitude of the first point.
 * @param {!number} latitude2 The latitude of the second point.
 * @param {!number} longitude2 The latitude of the second point.
 * @return {Object}  // google.maps.LatLng.
 */
const findMidPoint = function(latitude1, longitude1, latitude2, longitude2) {
  var DEG_TO_RAD = Math.PI / 180;     // To convert degrees to radians.

  // Convert latitude and longitudes to radians:
  var lat1 = latitude1 * DEG_TO_RAD;
  var lat2 = latitude2 * DEG_TO_RAD;
  var lng1 = longitude1 * DEG_TO_RAD;
  var dLng = (longitude2 - longitude1) * DEG_TO_RAD;  // Diff in longtitude.

  // Calculate mid-point:
  var bx = Math.cos(lat2) * Math.cos(dLng);
  var by = Math.cos(lat2) * Math.sin(dLng);
  var lat = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
    var lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);

    return [lat / DEG_TO_RAD, lng / DEG_TO_RAD];
  };

  /**
   * Returns the distance in kilometers  between two coordinates.
   * @see: http://www.movable-type.co.uk/scripts/latlong.html
   * @param {!number} lat1 The latitude of the first point (in degrees).
   * @param {!number} lng1 The longitude of the first point.
   * @param {!number} lat2 The latitude of the second point.
   * @param {!number} lng2 The longitude of the second point.
   * @return {number} The distance in kilometers between the points.
   */
  const distanceBetweenPoints = function(lat1, lng1, lat2, lng2) {
    var RADIUS_EARTH = 6371;            // Radius of the earth in kilometers.
    var DEG_TO_RAD = Math.PI / 180;     // To convert degrees to radians.

    var dLat = (lat2 - lat1) * DEG_TO_RAD;
    var dLng = (lng2 - lng1) * DEG_TO_RAD;
    lat1 = lat1 * DEG_TO_RAD;
    lat2 = lat2 * DEG_TO_RAD;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) *
    Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return RADIUS_EARTH * c;
  };

  module.exports = {
    createPlacesApiUrl,
    findMidPoint,
    distanceBetweenPoints
  }
