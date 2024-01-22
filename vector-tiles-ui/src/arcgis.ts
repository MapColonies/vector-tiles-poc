import '@arcgis/core/assets/esri/themes/light/main.css';
import ArcGISMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer.js';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer.js';

const wmtsLayer = new WMTSLayer({
  url: 'https://raster-mapproxy-int-nginx-route-integration.apps.j1lk3njp.eastus.aroapp.io/api/raster/v1/wmts/1.0.0/WMTSCapabilities.xml',
  customParameters: {
    token: import.meta.env.VITE_TOKEN,
  },
  activeLayer: {
    id: 'ARTZI_MZ-OrthophotoBest',
  },
});


const vectorTileLayer = new VectorTileLayer({
  // url: "http://localhost:7800/public.roads.json",
  url: 'http://localhost:7070/capabilities/osm.json'
  // style: {
  //   version: 8,
  //   name: 'Dark Matter',
  //   sources: {
  //     openmaptiles: {
  //       type: 'vector',
  //       tiles: [
  //         'http://localhost:8080/collections/public.roads/tiles/WorldCRS84Quad/{z}/{x}/{y}',
  //       ],
  //     },
  //   },
  //   layers: [
  //     {
  //       id: 'roads',
  //       type: 'line',
  //       metadata: {},
  //       source: 'openmaptiles',
  //       'source-layer': 'roads',
  //       layout: { 'line-cap': 'round', 'line-join': 'round' },
  //       paint: {
  //         'line-color': 'rgb(12,12,12)',
  //         'line-width': { base: 1.2 },
  //       },
  //     },
  //   ],
  //   id: 'dark-matter',
  // },
});

// pg-tileserv
// url: 'http://localhost:7800/public.wgs84_res/{z}/{x}/{y}.pbf'
// url: 'http://localhost:7800/public.roads/{z}/{x}/{y}.pbf'
// martin
// url: 'http://0.0.0.0:4000/roads/{z}/{x}/{y}'
// tipg
// url: "http://localhost:8080/collections/public.roads/tiles/WorldCRS84Quad/{z}/{x}/{y}",
// t-rex
// url: 'http://localhost:9090/osm/{z}/{x}/{y}.pbf'
// tegola
// url: 'http://localhost:7070/maps/osm/{z}/{x}/{y}.pbf'

const map = new ArcGISMap({
  // basemap: 'streets-vector'
  layers: [wmtsLayer, vectorTileLayer],
});

const view = new MapView({
  map: map,
  container: 'viewDiv',
  center: [-118.244, 34.052],
  zoom: 12,
});

view.when(() => {
  console.log('Map is loaded');
});
