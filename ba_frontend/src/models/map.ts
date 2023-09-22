import * as L from "leaflet";

export interface IMapState {
  bounds: L.LatLngBounds;
  zoom: number;
  mapDomHeight: number;
  mapDomWidth: number;
}
