import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as L from "leaflet";
import { IMapState } from "../../models/map";

const corner1: L.LatLng = L.latLng(45.65069174767784, 9.495565434256152),
  corner2: L.LatLng = L.latLng(49.21236738931146, 17.065145512381154),
  initialBounds: L.LatLngBounds = L.latLngBounds(corner1, corner2);

const initialState: IMapState = {
  bounds: initialBounds,
  zoom: 8,
  mapDomHeight: 0,
  mapDomWidth: 0,
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    setMapZoom: (state: IMapState, { payload }: PayloadAction<number>) => {
      state.zoom = payload;
    },
    setMapBounds: (
      state: IMapState,
      { payload }: PayloadAction<L.LatLngBounds>
    ) => {
      state.bounds = payload;
    },
    setMapDomDimensions: (
      state: IMapState,
      { payload }: PayloadAction<{ mapDomHeight: number; mapDomWidth: number }>
    ) => {
      state.mapDomHeight = payload.mapDomHeight;
      state.mapDomWidth = payload.mapDomWidth;
    },
  },
});

export default mapSlice.reducer;
