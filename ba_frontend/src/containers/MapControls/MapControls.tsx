import React from "react";
import { useMap } from "react-leaflet";
import locateSvg from "../../assets/svg/locate.svg";
import { useAppDispatch } from "../../hooks/redux";
import "./MapControls.scss";

export const MapControls = () => {
  const map = useMap();

  const onMouseEnter = () => {
    map.dragging.disable();
    map.doubleClickZoom.disable();
  };

  const onMouseLeave = () => {
    map.dragging.enable();
    map.doubleClickZoom.enable();
  };

  const recenter = () => {
    console.log("recenter");
  };

  return (
    <div
      className="MapControls"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="MapControls__container">
        <button className="MapControls__button" onClick={() => map.zoomIn()}>
          <span className="sr-only">Zoom In</span>+
        </button>
        <button className="MapControls__button" onClick={() => map.zoomOut()}>
          <span className="sr-only">Zoom Out</span>-
        </button>
      </div>
      <div className="MapControls__container">
        <button className="MapControls__button" onClick={recenter}>
          <span className="sr-only">Locate</span>
          <img src={locateSvg} alt="Locate Selection" />
        </button>
      </div>
    </div>
  );
};
