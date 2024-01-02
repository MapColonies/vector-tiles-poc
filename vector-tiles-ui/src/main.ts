import 'ol/ol.css';
import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import MVT from 'ol/format/MVT.js';
import XYZ from 'ol/source/XYZ';
import OGCVectorTile from 'ol/source/OGCVectorTile.js';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import { Stroke, Style } from 'ol/style.js';
import View from 'ol/View.js';
import { MapBrowserEvent } from 'ol';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png'
      }),
    }),
    new VectorTileLayer({
      //   source: new OGCVectorTile({
      //     format: new MVT(),
      //     url: 'http://localhost:8080/collections/public.roads/tiles/WorldCRS84Quad',

      //   }),
      source: new VectorTileSource({
        format: new MVT(),
        url: 'http://localhost:8080/collections/public.roads/tiles/WebMercatorQuad/{z}/{x}/{y}'
      }),
      style: [
        new Style({
          stroke: new Stroke({
            color: 'black',
            width: 1,
          }),
        }),
      ],
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

map.on('pointermove', showInfo);

const info = document.getElementById('info');
function showInfo(event: MapBrowserEvent<any>) {
  const features = map.getFeaturesAtPixel(event.pixel);
  if (info == null) {
    return;
  }
  if (features.length == 0) {
    info.innerText = '';
    info.style.opacity = '0';
    return;
  }
  const properties = features[0].getProperties();
  info.innerText = JSON.stringify(properties, null, 2);
  info.style.opacity = '1';
}
