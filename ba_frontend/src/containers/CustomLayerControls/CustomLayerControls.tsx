import { LatLngBoundsExpression, TileLayer as LeafletTileLayer } from "leaflet";
import React, { Fragment, RefObject, useEffect, useRef, useState } from "react";
import { TileLayer, useMap } from "react-leaflet";
import layersSvg from "../../../node_modules/leaflet/src/images/layers.svg";
import { tileLayerProps } from "../../constants/default-values";
import { TileLayerName } from "../../constants/enums";
import { useAppSelector } from "../../hooks/redux";
import "./CustomLayerControls.scss";

export interface ITileLayer {
  name: TileLayerName;
  attribution?: string;
  url: string;
  maxZoom: number;
  maxNativeZoom?: number;
  bounds: LatLngBoundsExpression;
}

export const CustomLayerControls = () => {
  const map = useMap();
  const bMapGrauLayerRadioRef: RefObject<HTMLInputElement> = useRef(null);

  const [activeTileLayerName, setActiveTileLayerName] = useState<TileLayerName>(
    TileLayerName.bMapGrau
  );
  const [showArticle, setShowArticle] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const tileLayerRef = useRef<LeafletTileLayer>(null);

  const { zoom } = useAppSelector((state) => state.mapReducer);

  useEffect(() => {
    if (null !== tileLayerRef.current) {
      const activeTileLayer = tileLayerProps.find(
        (t) => t.name == activeTileLayerName
      );
      if (activeTileLayer) {
        const { current } = tileLayerRef;
        current.setUrl(activeTileLayer.url);
        current.options.maxZoom = activeTileLayer.maxZoom;
        current.options.maxNativeZoom = activeTileLayer.maxNativeZoom;
        current.options.bounds = activeTileLayer.bounds;
      }
    }
  }, [activeTileLayerName]);

  const shouldDisableTileLayer = zoom < 11;

  useEffect(() => {
    if (shouldDisableTileLayer) {
      setActiveTileLayerName(TileLayerName.bMapGrau);
      if (bMapGrauLayerRadioRef.current) {
        bMapGrauLayerRadioRef.current.click();
      }
    }
  }, [shouldDisableTileLayer]);

  const handleTooltipToggle = (event: any) => {
    setShowTooltip(event.type === "mouseenter");
  };

  const getTileLayerOptions = () => {
    return tileLayerProps.map((tileLayer, index) => {
      if (index === 0) {
        return (
          <Fragment key={index}>
            <input
              ref={bMapGrauLayerRadioRef}
              id={tileLayer.name}
              type="radio"
              name="tilelayers"
              value={tileLayer.name}
              defaultChecked={tileLayer.name === activeTileLayerName}
            />
            <label htmlFor={tileLayer.name}>{tileLayer.name}</label>
          </Fragment>
        );
      } else {
        return (
          <Fragment key={index}>
            <input
              id={tileLayer.name}
              type="radio"
              name="tilelayers"
              value={tileLayer.name}
              defaultChecked={tileLayer.name === activeTileLayerName}
              disabled={shouldDisableTileLayer}
            />
            <label
              onMouseEnter={handleTooltipToggle}
              onMouseLeave={handleTooltipToggle}
              htmlFor={tileLayer.name}
            >
              {tileLayer.name}
            </label>
          </Fragment>
        );
      }
    });
  };

  const onBtnClickHandler = () => {
    setShowArticle(!showArticle);
  };

  const onTilelayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveTileLayerName(e.target.value as TileLayerName);
  };

  const onMouseEnter = () => {
    map.dragging.disable();
    map.doubleClickZoom.disable();
    setShowArticle(true);
  };

  const onMouseLeave = () => {
    map.dragging.enable();
    map.doubleClickZoom.enable();
    setShowArticle(false);
  };

  return (
    <div
      className="LayerControls"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className="LayerControls__button" onClick={onBtnClickHandler}>
        <img src={layersSvg} alt="Layer Selection" />
      </button>
      {showArticle && (
        <article
          className="LayerControls__article"
          onChange={onTilelayerChange}
        >
          <fieldset className="LayerControls__fieldset">
            <legend className="sr-only">Tilelayers</legend>
            {getTileLayerOptions()}
          </fieldset>
          {showTooltip && shouldDisableTileLayer && (
            <div className="tooltip">
              <p>Please zoom in to use these tile layers</p>
            </div>
          )}
        </article>
      )}

      <TileLayer
        ref={tileLayerRef}
        url="https://maps.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png"
        maxZoom={23}
        maxNativeZoom={19}
        bounds={[
          [46.35877, 8.782379],
          [49.037872, 17.189532],
        ]}
      />
    </div>
  );
};
