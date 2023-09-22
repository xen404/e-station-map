import * as React from "react";
import { NUTS_LVL } from "../../constants/enums";
import { useAppSelector } from "../../hooks/redux";
import { useGetNutsQuery } from "../../services/enpoints/nuts";
import { GeoJSON, Tooltip } from "react-leaflet";
import { NutsRegion } from "../../models/NUTSLevel";
import { useRef } from "react";

export interface IChoroplethProps {}

function perc2color(perc: number) {
  var r,
    g,
    b = 0;
  if (perc < 0) return "grey";
  if (perc < 50) {
    r = 230;
    g = Math.round(5.1 * perc);
  } else {
    g = 230;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

function InfoTooltip({ feature }: any) {
  const { count, name, freeStations, freePlugs } = feature;
  return (
    <Tooltip>
      <div
        style={{ display: "flex", flexDirection: "column" }}
        id="infoTooltipContainer"
      >
        <b>{name ? name : "-"}</b>
        <b>Estations total: {count ? count : "???"}</b>
        <b>
          Available:{" "}
          {count && freeStations > 0
            ? Math.floor((freeStations / count) * 100) + "%"
            : "???"}
        </b>
        <b>Available plugs: {freePlugs && freePlugs > 0 ? freePlugs : "???"}</b>
      </div>
    </Tooltip>
  );
}
function style(feature: NutsRegion) {
  const { stationsTotal, freeStations } = feature.properties;
  const freeStationsPercent = Math.floor((freeStations / stationsTotal) * 100);
  return {
    fillColor: perc2color(freeStationsPercent),
    weight: 1,
    opacity: 1,
    color: "white",
    dashArray: "2",
    fillOpacity: 0.5,
  };
}
export function Choropleth(props: IChoroplethProps) {
  const { current_NUTS_LVL, currentDate } = useAppSelector(
    (state) => state.metaInfoReducer
  );
  const featureInfo = useRef<any>({});

  const { data, isFetching } = useGetNutsQuery(
    { nutsLvl: current_NUTS_LVL, date: currentDate },
    {
      skip: current_NUTS_LVL === NUTS_LVL.NUTS0,
    }
  );

  const [onselect, setOnselect] = React.useState<any>(null);

  /* function determining what should happen onmouseover, this function updates our state*/
  const highlightFeature = (e: any) => {
    var layer = e.target;
    const { NAME_LATN, stationsTotal, freeStations, freePlugs } =
      e.target.feature.properties;
    featureInfo.current = {
      name: NAME_LATN,
      count: stationsTotal,
      freeStations,
      freePlugs,
    };
    setOnselect({
      county: NAME_LATN,
      stationsTotal,
    });

    layer.setStyle({
      weight: 1,
      color: "black",
      fillOpacity: 1,
    });
  };

  /*resets our state i.e no properties should be displayed when a feature is not clicked or hovered over */
  const resetHighlight = (e: any) => {
    setOnselect(null);
    e.target.setStyle(style(e.target.feature));
  };
  /* this function is called when a feature in the map is hovered over or when a mouse moves out of it, the function calls two functions
     highlightFeature and resetHighlight*/
  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  return (
    <div>
      {
        // @ts-ignore: Unreachable code error
        !isFetching &&
          current_NUTS_LVL === NUTS_LVL.NUTS1 &&
          data &&
          data.length === 3 && (
            // @ts-ignore: Unreachable code error
            <GeoJSON data={data} style={style} onEachFeature={onEachFeature}>
              <InfoTooltip feature={featureInfo.current} />
            </GeoJSON>
          )
      }
      {
        // @ts-ignore: Unreachable code error
        !isFetching &&
          current_NUTS_LVL === NUTS_LVL.NUTS2 &&
          data &&
          data.length === 9 && (
            // @ts-ignore: Unreachable code error
            <GeoJSON data={data} style={style} onEachFeature={onEachFeature}>
              <InfoTooltip feature={featureInfo.current} />
            </GeoJSON>
          )
      }
      {
        // @ts-ignore: Unreachable code error
        !isFetching &&
          current_NUTS_LVL === NUTS_LVL.NUTS3 &&
          data &&
          data.length === 35 && (
            // @ts-ignore: Unreachable code error
            <GeoJSON data={data} style={style} onEachFeature={onEachFeature}>
              <InfoTooltip feature={featureInfo.current} />
            </GeoJSON>
          )
      }{" "}
      {isFetching && data && data.length > 2 && (
        // @ts-ignore: Unreachable code error
        <GeoJSON data={data} style={style} onEachFeature={onEachFeature}>
          <InfoTooltip feature={featureInfo.current} />
        </GeoJSON>
      )}
    </div>
  );
}
