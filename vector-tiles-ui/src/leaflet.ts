import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'
import vectorGrid from 'leaflet.vectorgrid/dist'


const map = L.map('map', {crs: L.CRS.EPSG4326}).setView([31.5, 34.3], 10);

L.tileLayer(`https://raster-mapproxy-int-nginx-route-integration.apps.j1lk3njp.eastus.aroapp.io/api/raster/v1/wmts/ARTZI_MZ-OrthophotoBest/WorldCRS84/{z}/{x}/{y}.jpeg?token=${import.meta.env.VITE_TOKEN}`, {
    maxZoom: 19,
}).addTo(map);

L.vectorGrid.protobuf(`http://localhost:8080/collections/public.roads/tiles/WorldCRS84Quad/{z}/{x}/{y}`).addTo(map);

// console.log(vectorGrid)