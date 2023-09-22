import debounce from "lodash.debounce";
import React, { useCallback, useEffect } from "react";
import { useMap } from "react-leaflet";
import { batch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { mapSlice } from "../../services/slices/map";

export const MapMoveTracker = () => {
  const map = useMap();
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();

  const { bounds } = useAppSelector((state) => state.mapReducer);

  useEffect(() => {
    map.fitBounds(bounds);
    const newSearchParams = new URLSearchParams(params);
    newSearchParams.set("nelat", map.getBounds().getNorthEast().lat.toString());
    newSearchParams.set("nelng", map.getBounds().getNorthEast().lng.toString());
    newSearchParams.set("swlat", map.getBounds().getSouthWest().lat.toString());
    newSearchParams.set("swlng", map.getBounds().getSouthWest().lng.toString());
    setParams(newSearchParams);
  }, [map, bounds, setParams]);

  const onMoveHandler = () => {
    batch(() => {
      dispatch(mapSlice.actions.setMapZoom(map.getZoom()));
      dispatch(mapSlice.actions.setMapBounds(map.getBounds()));
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnMoveHandler = useCallback(debounce(onMoveHandler, 800), [
    map,
    debounce,
    dispatch,
    onMoveHandler,
    bounds,
  ]);

  useEffect(() => {
    map.on("moveend", debouncedOnMoveHandler);
    return () => {
      map.off("moveend", debouncedOnMoveHandler);
    };
  }, [map, debouncedOnMoveHandler]);
  return <></>;
};
