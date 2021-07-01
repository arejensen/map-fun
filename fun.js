var map = L.map("mapid").setView([68.798889, 16.531389], 18);
myIcon = L.icon({
    iconUrl: 'green_circle.png',
    iconSize: [6, 6],
});
map.on("contextmenu", function (event) {
  console.log("Coordinates: " + event.latlng.toString());
  L.marker(event.latlng).addTo(map);
});
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiYXJlamVuc2VuIiwiYSI6ImNrcWp2aTNzYTAzM2YyeG40Zmx6NG40Y2kifQ.LuDEWXxUICSdp5rpLLCBKw",
  }
).addTo(map);

async function createMovingMarker(from, to) {

  let waypoints = fetch(
    `http://localhost:5000/route/v1/driving/${from["lon"]},${from["lat"]};${to["lon"]},${to["lat"]}?overview=full&geometries=geojson`
  )
    .then((response) => response.json())
    .then((data) => data["routes"][0]["geometry"]["coordinates"])
    .then((coordinatePairs) => {
      return coordinatePairs.map((coordinatePair) => {
        return [coordinatePair[1], coordinatePair[0]];
      });
    });

  waypoints.then((coordinates) => {
    console.log("inside coordinates");
    L.motion
      .polyline(
        coordinates,
        {
          color: "transparent",
        },
        {
          auto: true,
          speed: 200,
          //duration: 3000,
          easing: L.Motion.Ease.linear,
          //easing: L.Motion.Ease.easeInOutQuart,
        },
        {
          removeOnEnd: true,
          showMarker: true,
          icon: myIcon,
          // icon: L.divIcon({
          //   html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>",
          //   iconSize: L.point(27.5, 24),
          //}),
        }
      )
      .addTo(map);
  });
}

// L.Routing.control({
//   waypoints: [
//     L.latLng(68.798889, 16.531389),
//     L.latLng(67.283333, 14.383333)
//     // L.latLng(16.531389, 68.798889),
//     // L.latLng(14.383333, 67.283333)
//   ],
//   serviceUrl: 'http://localhost:5000/route/v1'
// }).addTo(map);


let from = { lon: 16.531389, lat: 68.798889 };
let to = { lon: 14.383333, lat: 67.283333 };

(async () => {
  await createMovingMarker(from, to);
  setTimeout(() => createMovingMarker(from, to), 10000);
})();
