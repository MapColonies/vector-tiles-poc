import "ol/ol.css";
import "./style.css";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import MVT from "ol/format/MVT.js";
import XYZ from "ol/source/XYZ";
import TileDebug from "ol/source/TileDebug.js";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS.js";
import WMTSCapabilities from "ol/format/WMTSCapabilities.js";

import OGCVectorTile from "ol/source/OGCVectorTile.js";
import VectorTileSource from "ol/source/VectorTile";
import VectorTileLayer from "ol/layer/VectorTile.js";
import { Stroke, Style } from "ol/style.js";
import View from "ol/View.js";
import { MapBrowserEvent } from "ol";
import TileGrid from "ol/tilegrid/TileGrid";

const TOKEN =
  "";

const parser = new WMTSCapabilities();

// define openlayers tile grid for geographic with 1x1 tiles
const wgs84onebyonegrid = new TileGrid({
  extent: [-180, -180, 180, 180],
  origin: [-180, 180],
  resolutions: [
    1.40625,
    0.703125,
    0.3515625,
    0.17578125,
    0.087890625,
    0.0439453125,
    0.02197265625,
    0.010986328125,
    0.0054931640625,
    0.00274658203125,
    0.001373291015625,
    0.0006866455078125,
    0.00034332275390625,
    0.000171661376953125,
    0.0000858306884765625,
    0.00004291534423828125,
    0.000021457672119140625,
    0.000010728836059570312,
    0.000005364418029785156,
    0.000002682209014892578,
    0.000001341104507446289,
    0.0000006705522537231445,
    0.00000033527612686157227,
    0.00000016763806343078613,
    0.000000083819031715393066,
    0.000000041909515857696533,
    0.000000020954757928848267,
    0.000000010477378964424133,
    0.0000000052386894822120667,
    0.0000000026193447411060333,
    0.0000000013096723705530167,
    0.0000000006548361852765084,
    0.0000000003274180926382542,
    0.0000000001637090463191271,
    0.00000000008185452315956354,
    0.00000000004092726157978177,
    0.000000000020463630789890884,
    0.000000000010231815394945442,
    0.000000000005115907697472721,
    0.0000000000025579538487363607],
  tileSize: [256, 256],
});


fetch(
  "https://raster-mapproxy-int-nginx-route-integration.apps.j1lk3njp.eastus.aroapp.io/api/raster/v1/wmts/1.0.0/WMTSCapabilities.xml?token=" +
    TOKEN
)
  .then((response) => response.text())
  .then((text) => {
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
      layer: "ARTZI_MZ-OrthophotoBest",
      // layer: 'goat_ofer_layer-Orthophoto',
      matrixSet: "WorldCRS84",
    });

    options!.urls = options!.urls?.map((url) => {
      console.log(url);
      
      return url.concat("?token=" + TOKEN);
    });

    console.log('wgs84',options?.tileGrid?.getExtent(), options?.tileGrid?.getResolutions());

    const vectorTileLayer = new VectorTileLayer({

      //   source: new OGCVectorTile({
      //     format: new MVT(),
      //     url: 'http://localhost:8080/collections/public.roads/tiles/WorldCRS84Quad',
    
      //   }),
      source: new VectorTileSource({
        // tileGrid: options!.tileGrid,
        tileGrid: wgs84onebyonegrid,
        zDirection: 1,

        format: new MVT(),
        projection: "EPSG:4326",
        // pg-tileserv
        // url: 'http://localhost:7800/public.wgs84_res/{z}/{x}/{y}.pbf'
        url: 'http://localhost:7800/public.roads/{z}/{x}/{y}.pbf'
        // martin
        // url: 'http://0.0.0.0:4000/roads/{z}/{x}/{y}'
        // tipg
        // url: "http://localhost:8080/collections/public.roads/tiles/WorldCRS84Quad/{z}/{x}/{y}",
        // t-rex
        // url: 'http://localhost:9090/osm/{z}/{x}/{y}.pbf'
        // tegola
        // url: 'http://localhost:7070/maps/osm/{z}/{x}/{y}.pbf'
        
      }),
      style: [
        new Style({
          stroke: new Stroke({
            color: "black",
            width: 1,
          }),
        }),
      ],
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new WMTS(options!),
        }),
        vectorTileLayer,
        new TileLayer({
          source: new TileDebug({
            projection: "EPSG:4326",
            tileGrid: vectorTileLayer.getSource()?.getTileGrid() ?? undefined,
            // tileGrid: options?.tileGrid,
          }),
        }),
      ],
      view: new View({
        center: [34, 31],
        projection: "EPSG:4326",
        minZoom: 0,
        zoom: 10,
      }),
    });

    map.on("pointermove", showInfo);

    const info = document.getElementById("info");
    function showInfo(event: MapBrowserEvent<any>) {
      const features = map.getFeaturesAtPixel(event.pixel);
      if (info == null) {
        return;
      }
      if (features.length == 0) {
        info.innerText = "";
        info.style.opacity = "0";
        return;
      }
      const properties = features[0].getProperties();
      info.innerText = JSON.stringify(properties, null, 2);
      info.style.opacity = "1";
    }
  });
