import React, { useState } from "react";
import { Fieldset } from "../../components/Fieldset/Fieldset";
import { NUTS_LVL } from "../../constants/enums";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { metaInfoSlice } from "../../services/slices/metaInfo";
import { StationFilters } from "../StationFilters/StationFilters";
import filtersIcon from "../../assets/svg/filters_icon.svg";

import "./Header.scss";

const Header = () => {
  const dispatch = useAppDispatch();
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const { current_NUTS_LVL } = useAppSelector((state) => state.metaInfoReducer);

  const generateFieldsetOptions = () => {
    const fieldsetOptions = [
      {
        label: "NUTS0",
        value: "NUTS0",
        checked: current_NUTS_LVL === NUTS_LVL.NUTS0,
        disabled: false,
      },
      {
        label: "NUTS1",
        value: "NUTS1",
        checked: current_NUTS_LVL === NUTS_LVL.NUTS1,
        disabled: false,
      },
      {
        label: "NUTS2",
        value: "NUTS2",
        checked: current_NUTS_LVL === NUTS_LVL.NUTS2,
        disabled: false,
      },
      {
        label: "NUTS3",
        value: "NUTS3",
        checked: current_NUTS_LVL === NUTS_LVL.NUTS3,
        disabled: false,
      },
    ];
    return fieldsetOptions;
  };
  const onFilterClick = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const onNutsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const NUTS = NUTS_LVL[e.target.value as keyof typeof NUTS_LVL];

    dispatch(metaInfoSlice.actions.setNUTS_LVL(NUTS));
  };

  return (
    <header className="Header">
      <div className="Header__container">
        <div className="Header__titleContainer">
          <h1>E-STATIONS MAP</h1>
        </div>
        <div className="Header__controls">
          <button className={!isFilterVisible ? "Header__filterButton_active" : "Header__filterButton"} onClick={onFilterClick}>
            <img
              className={!isFilterVisible ? "Header__icon_active" : ""}
              src={filtersIcon}
              alt="pause icon"
            />
          </button>
          <Fieldset
            legend="Typ"
            options={generateFieldsetOptions()}
            onChange={onNutsChange}
          ></Fieldset>
        </div>
      </div>
      <StationFilters className={isFilterVisible ? "_hidden" : ""} />
    </header>
  );
};

export default Header;
