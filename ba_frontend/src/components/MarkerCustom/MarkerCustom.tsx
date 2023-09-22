import * as React from "react";
import { Marker } from "react-leaflet";
import greenMarker from "../../assets/svg/green-marker.svg";
import yellowMarker from "../../assets/svg/yellow-marker.svg";
import redMarker from "../../assets/svg/red-marker.svg";
import grayMarker from "../../assets/svg/gray-marker.svg";
import brokenMarker from "../../assets/svg/broken-marker.svg";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { Plug, PlugStatus } from "../../models/estation";
import { useAppSelector } from "../../hooks/redux";

export interface IMarkerCustomProps {
  children?: any;
  position: L.LatLngExpression;
  index: number;
  onMarkerClick: (stationId: number) => void;
  stationid: number;
  plugs: Plug[];
}

const greenMarkerIcon = L.icon({
  iconUrl: greenMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const redMarkerIcon = L.icon({
  iconUrl: redMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
const grayMarkerIcon = L.icon({
  iconUrl: grayMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
const yellowMarkerIcon = L.icon({
  iconUrl: yellowMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
const brokenMarkerIcon = L.icon({
  iconUrl: brokenMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const whiteCircleIcon = L.divIcon({
  iconSize: [12, 12],
  className: "leaflet-div-icon",
  iconAnchor: [5, 33],
});

export default function MarkerCustom(props: IMarkerCustomProps) {
  const { children, position, index, onMarkerClick, plugs, stationid } = props;

  const { showAvailableOnly } = useAppSelector(
    (state) => state.metaInfoReducer
  );

  if (!plugs) return <></>;

  const allPlugsStatusEqualTo = (plugStatus: PlugStatus) => {
    let result = true;
    result = plugs.every((p) => {
      if (p.status === plugStatus) {
        return true;
      }
    });

    return result;
  };

  if (showAvailableOnly && allPlugsStatusEqualTo(PlugStatus.BUSY)) {
    return <></>;
  }

  const getIconBasedOnPlugStatus = () => {
    const freePlug = plugs.find((p) => p.status === PlugStatus.FREE);
    if (freePlug) {
      return greenMarkerIcon;
    }
    if (allPlugsStatusEqualTo(PlugStatus.UNKNOWN)) {
      return grayMarkerIcon;
    }
    if (allPlugsStatusEqualTo(PlugStatus.BUSY)) {
      return redMarkerIcon;
    }
    if (allPlugsStatusEqualTo(PlugStatus.OUT_OF_ORDER)) {
      return brokenMarkerIcon;
    }
    if (allPlugsStatusEqualTo(PlugStatus.RESERVED)) {
      return yellowMarkerIcon;
    }
    return grayMarkerIcon;
  };

  return (
    <>
      <Marker
        key={index + "-div-marker"}
        icon={whiteCircleIcon}
        position={position}
      />
      <Marker
        key={index}
        icon={getIconBasedOnPlugStatus()}
        position={position}
        eventHandlers={{
          click: () => onMarkerClick(stationid),
        }}
      >
        {children}
      </Marker>
    </>
  );
}
