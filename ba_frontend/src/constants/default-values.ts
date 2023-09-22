import L from "leaflet";
import { ITileLayer } from "../containers/CustomLayerControls/CustomLayerControls";
import { TileLayerName } from "./enums";

export const corner1: L.LatLng = L.latLng(45.65069174767784, 9.495565434256152),
  corner2: L.LatLng = L.latLng(49.21236738931146, 17.065145512381154),
  boundsOfAustria: L.LatLngBounds = L.latLngBounds(corner1, corner2);

export const drawToolbarOptions: L.Control.DrawOptions | undefined = {
  circle: false,
  circlemarker: false,
  polyline: false,
  marker: false,
  rectangle: false,
  polygon: {
    shapeOptions: {
      color: "purple",
    },
    allowIntersection: false,
    drawError: {
      color: "orange",
      timeout: 1000,
    },
    showArea: true,
    metric: true,
  },
};

export const stationZoomLvl = 14;
export const gkZoomLvl = 16;
export const DEFAULT_DATE = new Date(2022, 4, 10, 10, 10);

export const tileLayerProps: ITileLayer[] = [
  {
    name: TileLayerName.bMapGrau,
    attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
    url: "https://maps.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png",
    maxZoom: 23,
    maxNativeZoom: 19,
    bounds: [
      [46.35877, 8.782379],
      [49.037872, 17.189532],
    ],
  },
  {
    name: TileLayerName.openStreetMap,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 23,
    maxNativeZoom: 19,
    bounds: [
      [46.35877, 8.782379],
      [49.037872, 17.189532],
    ],
  },
  {
    name: TileLayerName.bMapOrtho,
    attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
    url: "https://maps.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg",
    maxZoom: 23,
    maxNativeZoom: 19,
    bounds: [
      [46.35877, 8.782379],
      [49.037872, 17.189532],
    ],
  },
];
