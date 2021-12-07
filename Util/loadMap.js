export const loadMap = (
  element,
  lat = 38.8125889,
  long = -77.18318725,
  zoom = 20
) => {
  let myMap = L.map(element, { scrollWheelZoom: false }).setView(
    [lat, long],
    12
  );
  console.log(`map loaded`);

  const googleView = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: zoom,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  ).addTo(myMap);

  return myMap;
};

export const getGeoLocationFromBrowser = (CB) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(CB);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

export default loadMap;
