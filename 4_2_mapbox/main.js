mapboxgl.accessToken = 'pk.eyJ1Ijoic2t5ZTMiLCJhIjoiY2x2djZ3eGNnMXR1dDJpbzB5ZjZldDR2ayJ9.Mshm1kXAPLKm5imU76Szww';


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/skye3/clvvbxuz4095x01pk9erz6a2t',
    center: [-73.8804, 40.53483],
    pitch: 60,
    //bearing: -60,
    zoom: 10
});

const nzPopUp = new mapboxgl.Popup().setText("Favorite Stationery Store!")

const niconecoZakkaya = new mapboxgl.Marker()
    .setLngLat([-73.98325, 40.7293])
    .setPopup(nzPopUp)
    .addTo(map)

   
const favoritePlaces = [
    {
        name: "Central Park",
        coordinates: [-73.968285, 40.785091],
        description: "Most famous NYC park"
    },
    {
        name: "McNally Jackson Books SoHo",
        coordinates: [-74.000926534, 40.726398788],
        description: "Fav Bookstore (I can peruse through the shelves for hours!)"
    },
    {
        name: "Elizabeth Street Garden",
        coordinates: [-73.99497518043401, 40.72296908955226],
        description: "A delightful public space for the locals and tourists!"
    },

];


favoritePlaces.forEach(place => {
    const popup = new mapboxgl.Popup().setText(place.description);
    new mapboxgl.Marker()
        .setLngLat(place.coordinates)
        .setPopup(popup)
        .addTo(map);
});
