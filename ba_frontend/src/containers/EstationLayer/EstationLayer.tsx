import { LatLngBounds } from "leaflet";
import React, { useEffect, useState } from "react";
import { LayerGroup, useMap } from "react-leaflet";
import { Portal } from "../../components/Portal/Portal";
import { useAppSelector } from "../../hooks/redux";
import { Estation, PlugStatus } from "../../models/estation";
import {
  useGetEstationInfoQuery,
  useGetEstationsInBoundsQuery,
} from "../../services/enpoints/eStation";
import { StationDialog } from "../StationDialog/StationDialog";
import MarkerCustom from "../../components/MarkerCustom/MarkerCustom";

export const EstationLayer = () => {
  const map = useMap();

  const [selectedStationId, setSelectedStationId] = useState<Estation | null>(
    null
  );
  const [currentMaxBounds, setCurrentMaxBounds] = useState<LatLngBounds>();

  const { bounds } = useAppSelector((state) => state.mapReducer);
  const { currentDate, filters, showAvailableOnly } = useAppSelector(
    (state) => state.metaInfoReducer
  );

  const { data: stations } = useGetEstationsInBoundsQuery({
    bounds: currentMaxBounds!,
    date: currentDate,
    filters,
    showAvailableOnly,
  });
  const { data: stationInfo } = useGetEstationInfoQuery(
    {
      stationId: selectedStationId ? selectedStationId.stationid : 0,
      date: currentDate,
    },
    { skip: !selectedStationId }
  );

  useEffect(() => {
    if (bounds) {
      setCurrentMaxBounds(map.getBounds());
    }
  }, [map, bounds]);

  map.on("click", () => setSelectedStationId(null));
  const generateStations = () => {
    if (stations && stations.length) {
      let markers = stations;
      if (showAvailableOnly) {
        markers = markers.filter((marker) => {
          return marker.plugs.some((plug) => plug.status === PlugStatus.FREE);
        });
      }
      return markers.map(({ lat, lng, stationid, plugs }, index) => {
        return (
          <MarkerCustom
            key={index}
            index={index}
            onMarkerClick={onStationClickHandler}
            position={[lat, lng]}
            plugs={plugs}
            stationid={stationid}
          />
        );
      });
    }
  };

  const onStationClickHandler = (stationId: number) => {
    const selectedStation = stations?.find((s) => s.stationid === stationId);
    if (!selectedStation) return;
    setSelectedStationId(selectedStation);
  };

  const onDialogCancel = () => setSelectedStationId(null);

  return (
    <LayerGroup>
      {generateStations()}
      <Portal className="Portal" el="aside">
        {stationInfo && selectedStationId && (
          <StationDialog
            station={stationInfo}
            onCancelHandler={onDialogCancel}
          ></StationDialog>
        )}
      </Portal>
    </LayerGroup>
  );
};
