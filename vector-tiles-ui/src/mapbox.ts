import {Map} from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const map = new Map({
  container: 'map',
  center: [0, 0],
  testMode: true,
  zoom: 2
});

// map.on('load', () => {
  map.addSource('osm', {
    type: 'raster',
    scheme: 'xyz',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256
  });
  console.log('lol')
  map.addLayer({
    id: 'osm',
    type: 'raster',
    source: 'osm',
  });
// });