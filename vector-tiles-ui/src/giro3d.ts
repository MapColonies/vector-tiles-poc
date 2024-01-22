import "ol/ol.css";
import "./style.css";
import { WMTSCapabilities } from "ol/format.js";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS.js";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import Extent from "@giro3d/giro3d/core/geographic/Extent.js";
import Instance from "@giro3d/giro3d/core/Instance.js";
import ColorLayer from "@giro3d/giro3d/core/layer/ColorLayer.js";
import Map from "@giro3d/giro3d/entities/Map.js";
import Inspector from "@giro3d/giro3d/gui/Inspector.js";
import TiledImageSource from "@giro3d/giro3d/sources/TiledImageSource.js";
import TileLayer from "ol/layer/Tile";
import Panel from "@giro3d/giro3d/gui/Panel";
import GUI from "lil-gui";
import XYZ from "ol/source/XYZ";


// const extent = new Extent("EPSG:4326", 33,37,29,33);
const extent = new Extent(
  'EPSG:3857',
  -20037508.342789244, 20037508.342789244,
  -20037508.342789244, 20037508.342789244,
);

// `viewerDiv` will contain giro3d' rendering area (the canvas element)
const viewerDiv = document.getElementById("viewerDiv");

if (!viewerDiv) {
  throw new Error("Viewer div not found");
}

console.log(extent.crs());


// Creates a giro3d instance
const instance = new Instance(viewerDiv, {
  crs: extent.crs(),
  renderer: {
    clearColor: 0xFF0000,
  },
});

// Creates a map that will contain the layer
const map = new Map("map", { extent, });

instance.add(map);

// We use OpenLayer's optionsFromCapabilities to parse the capabilities document
// and create our WMTS source.
fetch(
  "https://raster-mapproxy-int-nginx-route-integration.apps.j1lk3njp.eastus.aroapp.io/api/raster/v1/wmts/1.0.0/WMTSCapabilities.xml?token=" +
    import.meta.env.VITE_TOKEN
)
  .then(async (response) => {
    const data = await response.text();
    const parser = new WMTSCapabilities();
    const capabilities = parser.read(data);
    console.log(capabilities);
    
    const options = optionsFromCapabilities(capabilities, {
      layer: "ARTZI_MZ-OrthophotoBest",
      // layer: "goat_ofer_layer-Orthophoto",
      matrixSet: "WorldCRS84",
    });

    options!.urls = options!.urls?.map((url) => {
      console.log(url);

      return url.concat("?token=" + import.meta.env.VITE_TOKEN);
    });

    if (!options) {
      throw new Error("No options");
    }

    // const tileLayer = new TileLayer({
    //   source: new WMTS(options!),
    // })
    // map.addLayer(tileLayer);
    const source = new TiledImageSource({ source: new XYZ({url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',projection: 'EPSG:3857',})});
    // const source = new TiledImageSource({ source: new WMTS(options)});
    console.log('im here');
    
    map.addLayer(new ColorLayer("wmts", { source,showTileBorders: true, }));
    map.getLayers().forEach((layer) => {
      console.log(layer); 
    });
  })
  .catch((e) => console.error(e));

instance.camera.camera3D.position.set(0, 0, 80000000);

const controls = new MapControls(instance.camera.camera3D, instance.domElement);

// const center = extent.center();
    // instance.camera.camera3D.position.set(center.x(), center.y() - 1, extent.dimensions().y * 2);

instance.useTHREEControls(controls);
