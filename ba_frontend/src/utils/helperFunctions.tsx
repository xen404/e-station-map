import React from "react";
import L from "leaflet";

import errorSvg from "../assets/svg/alert-outlined.svg";
import { ToastContent, ToastOptions } from "react-toastify";

export const checkIfMatch = (
  propsToCheck: string[],
  filterText: string
): boolean => {
  const match = propsToCheck.find((element) => {
    return element
      .replace(/ /g, "")
      .toLocaleLowerCase()
      .includes(filterText.toLocaleLowerCase());
  });
  return match ? true : false;
};

export const castLatLngBounds = (
  notWellCastedBounds: L.LatLngBounds
): L.LatLngBounds => {
  const jsonBounds = JSON.parse(JSON.stringify(notWellCastedBounds));
  const swlat = jsonBounds[1][0];
  const swlon = jsonBounds[1][1];
  const nelat = jsonBounds[0][0];
  const nelon = jsonBounds[0][1];
  const poperlyCastedBounds: L.LatLngBounds = L.latLngBounds(
    [nelat, nelon],
    [swlat, swlon]
  );
  return poperlyCastedBounds;
};

export const calcZoomLevel = (
  bounds: L.LatLngBounds,
  mapDimensions: { mapDomHeight: number; mapDomWidth: number }
): number => {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  function latRad(lat: number) {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }
  const jsonBounds = JSON.parse(JSON.stringify(bounds));
  let ne;
  let sw;

  if (jsonBounds._northEast) {
    ne = bounds.getNorthEast();
    sw = bounds.getSouthWest();
  } else {
    const swlat = jsonBounds[1][0];
    const swlon = jsonBounds[1][1];
    const nelat = jsonBounds[0][0];
    const nelon = jsonBounds[0][1];
    const corner1 = L.latLng(nelat, nelon);
    const corner2 = L.latLng(swlat, swlon);
    const tempBounds = L.latLngBounds(corner1, corner2);

    ne = tempBounds.getNorthEast();
    sw = tempBounds.getSouthWest();
  }

  const latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

  const lngDiff = ne.lng - sw.lng;
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(
    mapDimensions.mapDomHeight,
    WORLD_DIM.height,
    latFraction
  );
  const lngZoom = zoom(mapDimensions.mapDomWidth, WORLD_DIM.width, lngFraction);
  return Math.min(latZoom, lngZoom, ZOOM_MAX);
};

export const getDurationByLength = (message: string): number => {
  const baseDuration = 1500;
  return baseDuration + message.length * 50;
};

export const generateErrorToast = (
  message: string
): { template: ToastContent; options: ToastOptions } => {
  const template = (
    <>
      <span className="Toast__error">
        <img src={errorSvg} alt="Error Icon" />
        Warnung
      </span>
      <span className="Toast__error-message">{message}</span>
    </>
  );

  return {
    template,
    options: {
      autoClose: getDurationByLength(message),
      position: "top-center",
      hideProgressBar: true,
      bodyClassName: "Toast",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      icon: false,
      closeButton: false,
    },
  };
};
