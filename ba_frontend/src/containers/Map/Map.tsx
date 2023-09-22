import React, { useEffect, useRef } from "react";
import { MapContainer } from "react-leaflet";
import { stationZoomLvl } from "../../constants/default-values";
import { NUTS_LVL } from "../../constants/enums";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { mapSlice } from "../../services/slices/map";
import { calcZoomLevel } from "../../utils/helperFunctions";
import { CustomLayerControls } from "../CustomLayerControls/CustomLayerControls";
import { MapControls } from "../MapControls/MapControls";
import { MapMoveTracker } from "../MapMoveTracker/MapMoveTracker";
import MarkerCluster from "../MarkerCluster/MarkerCluster";
import "./Map.scss";
import { Choropleth } from "../Choropleth/Choropleth";
import { EstationLayer } from "../EstationLayer/EstationLayer";
import { Portal } from "../../components/Portal/Portal";
import Sidebar from "../Sidebar/Sidebar";
import { DateSlider } from "../DateSlider/DateSlider";

export const Map = () => {
  const dispatch = useAppDispatch();
  const { current_NUTS_LVL } = useAppSelector((state) => state.metaInfoReducer);
  const { zoom, mapDomHeight, mapDomWidth, bounds } = useAppSelector(
    (state) => state.mapReducer
  );

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const dimensions = {
        mapDomHeight: ref.current?.offsetHeight,
        mapDomWidth: ref.current?.offsetWidth,
      };
      dispatch(mapSlice.actions.setMapDomDimensions(dimensions));
    }
  }, [ref, dispatch]);

  useEffect(() => {
    const zoomLevel = calcZoomLevel(bounds, {
      mapDomHeight,
      mapDomWidth,
    });
    dispatch(mapSlice.actions.setMapZoom(zoomLevel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapDomHeight, mapDomWidth]);

  return (
    <section className="Map" ref={ref}>
      <h2 className="sr-only">Map</h2>
      <MapContainer
        className="Map__container"
        center={[51.505, -0.09]}
        zoom={13}
        zoomControl={false}
      >
        <Portal className="Portal" el="aside">
          <Sidebar />
          <DateSlider />
        </Portal>
        <Choropleth />
        {zoom < stationZoomLvl && <MarkerCluster />}
        {zoom >= stationZoomLvl && current_NUTS_LVL === NUTS_LVL.NUTS0 && (
          <EstationLayer />
        )}

        <CustomLayerControls />
        <MapControls />
        <MapMoveTracker />
      </MapContainer>
    </section>
  );
};
