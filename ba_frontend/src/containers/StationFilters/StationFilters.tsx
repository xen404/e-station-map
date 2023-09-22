import React, { useEffect, useState } from "react";
import { Checkbox } from "../../components/Checkbox/Checkbox";

import { stationFilters } from "../../constants/stationFilters";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { metaInfoSlice } from "../../services/slices/metaInfo";
import "./StationFilters.scss";
import { stationZoomLvl } from "../../constants/default-values";
import { NUTS_LVL } from "../../constants/enums";

export interface IStationFilters {
  className?: string;
}
export const StationFilters = (props: IStationFilters) => {
  const { className } = props;
  const dispatch = useAppDispatch();

  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const classes = [className ? className : ""];

  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [showGreenStations, setShowGreenStations] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { current_NUTS_LVL } = useAppSelector((state) => state.metaInfoReducer);
  const { zoom } = useAppSelector((state) => state.mapReducer);

  const shouldDisableAvailabilityFilter =
    zoom < stationZoomLvl || current_NUTS_LVL !== NUTS_LVL.NUTS0;

  useEffect(() => {
    dispatch(metaInfoSlice.actions.setFilters(checkedValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedValues]);

  useEffect(() => {
    dispatch(metaInfoSlice.actions.setShowAvailableOnly(showAvailableOnly));
    setShowGreenStations(showAvailableOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAvailableOnly]);

  useEffect(() => {
    if (shouldDisableAvailabilityFilter) {
      setShowGreenStations(false);

      dispatch(metaInfoSlice.actions.setShowAvailableOnly(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldDisableAvailabilityFilter]);

  const handleFilterCheckboxChange = (event: any) => {
    const value = event.target.value;
    if (event.target.checked) {
      // Add value to checkedValues array if checkbox is checked
      setCheckedValues((prevCheckedValues: any) => [
        ...prevCheckedValues,
        value,
      ]);
    } else {
      // Remove value from checkedValues array if checkbox is unchecked
      setCheckedValues((prevCheckedValues: any[]) =>
        prevCheckedValues.filter((v) => v !== value)
      );
    }
  };

  const handleAvailableOnlyCheckbox = () => {
    setShowAvailableOnly(!showAvailableOnly);
  };

  const handleTooltipToggle = (event: any) => {
    setShowTooltip(event.type === "mouseenter");
  };

  const generateCheckboxes = () => {
    return stationFilters.map((plugType) => {
      return (
        <Checkbox
          id={plugType}
          key={plugType}
          value={plugType}
          onChange={handleFilterCheckboxChange}
        >
          {plugType}
        </Checkbox>
      );
    });
  };

  return (
    <section className={`StationFilters${classes}`}>
      <div className="StationFilters__filters">
        <div
          onMouseEnter={handleTooltipToggle}
          onMouseLeave={handleTooltipToggle}
        >
          <Checkbox
            id="available"
            key="available"
            value="available"
            onChange={handleAvailableOnlyCheckbox}
            disabled={shouldDisableAvailabilityFilter}
            checked={showGreenStations}
          >
            Show available only
          </Checkbox>
        </div>
        {showTooltip && (
          <div className="tooltip">
            <p>Please zoom in and turn off choropleth mode</p>
          </div>
        )}
        <span>Plug type</span>
        {generateCheckboxes()}
      </div>
    </section>
  );
};
