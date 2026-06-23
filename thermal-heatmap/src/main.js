import './style.css'
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const map = new maplibregl.Map({
    container: 'map', // container id
    style: "https://api.maptiler.com/maps/019e219b-3d02-7b12-a1a2-d5c121e744fd/style.json?key=CFMtBUi2cHYbNygumEnc", // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1 // starting zoom
});

map.addControl(new maplibregl.NavigationControl ({
  visualizePitch: true,
  visualizeRoll: true,
  showZoom: true,
  showCompass: true
}))

let earthquakeData = null;

map.on('load', async() => {
  map.addSource("heatmaped", {
    type: "geojson",
    data: { type: "FeatureCollection", features: []},

  })
  map.addLayer({
    id: "heated-layer",
    source: "heatmaped",
    type: "heatmap",
    maxzoom: 9,
    paint: {}

  })
  map.addLayer({
    id: "zoomed-heat",
    source: "heatmaped",
    type: "circle",
    minzoom: 9,
    paint: {
      "circle-color": 'orange',
      "circle-radius": 10
    }
  })

const url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
  try {
    const response = await fetch(url);
    let setData = await response.json()
      earthquakeData = setData// don't do setData = earthquakeData as that will put the empty the data of earthquakeData to setData 
  
    if (map.getSource("heatmaped"))
       {
        map.getSource("heatmaped").setData(earthquakeData)
      }
  }
 catch(error) {
    console.error(error.message);
  }
  //UI

document.getElementById("wipe").addEventListener("input",(event) => {
  let currentMag = parseFloat(event.target.value);
 map.setFilter("heated-layer",["<=",["get","mag"],currentMag])
 map.setFilter("zoomed-heat",["<=",["get","mag"],currentMag])
 })

})

document.getElementById("ask").addEventListener("click",(e) => {
  map.flyTo({
    center: [-119.4180, 36.7783],
    zoom: 4,
    pitch: 40,  // see-saw (tilt) of map
    bearing: 30,  //compass (N, E, W,S...)
    speed: 0.8
  })
})
document.getElementById("talk").addEventListener("click",() => {
  map.flyTo ({
    center: [139.6503, 35.6762],
    zoom: 8,
   
  })
})
document.getElementById("fuck").addEventListener("click",() => {
  map.flyTo ({
    center:[38.7636, 9.0008],
    zoom: 2,
    bearing:0,
    pitch:0,
  })
})