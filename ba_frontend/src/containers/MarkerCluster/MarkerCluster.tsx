import L from "leaflet";
import * as React from "react";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/dist/styles.min.css";
import { boundsOfAustria } from "../../constants/default-values";
import { NUTS_LVL } from "../../constants/enums";
import { useAppSelector } from "../../hooks/redux";
import { useGetStationClusterQuery } from "../../services/enpoints/markerCluster";
import "./MarkerCluster.scss";

function MarkerCluster() {
  const { current_NUTS_LVL, filters, showAvailableOnly } = useAppSelector(
    (state) => state.metaInfoReducer
  );

  const { data: stationCluster } = useGetStationClusterQuery({
    bounds: boundsOfAustria,
    filters,
    showAvailableOnly,
  });

  const markers = function (cluster: L.MarkerCluster) {
    let modifier = "";
    const count = cluster.getChildCount();

    if (count > 100) {
      modifier = "Cluster__marker--3";
    } else if (count > 50) {
      modifier = "Cluster__marker--2";
    } else {
      modifier = "Cluster__marker--1";
    }

    return L.divIcon({
      html: `<button class="Cluster__marker ${modifier}">
								${count}
						 </button>`,
    });
  };

  const markerComponents = useMemo(() => {
    const cluster = stationCluster;
    return (
      cluster &&
      cluster.map((station, index) => {
        if (!station.lat || !station.lng) {
          console.log("ERROR");
        }

        const object = new L.LatLng(station.lat, station.lng);

        return <Marker key={index} position={object} />;
      })
    );
  }, [stationCluster]);

  return (
    <>
      <>
        {stationCluster && current_NUTS_LVL === NUTS_LVL.NUTS0 && (
          <MarkerClusterGroup
            iconCreateFunction={markers}
            singleMarkerMode={true}
          >
            {markerComponents}
          </MarkerClusterGroup>
        )}
      </>
    </>
  );
}

export default MarkerCluster;
