import * as React from "react";
import dateTimeIcon from "../../assets/svg/date-time-picker.svg";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import "./SliderDateTimePicker.scss";
import { useAppSelector } from "../../hooks/redux";
import { NUTS_LVL } from "../../constants/enums";
import { stationZoomLvl } from "../../constants/default-values";
import { Fragment, useState } from "react";

export interface SliderDateTimePickerProps {
  isDatePickerVisible: boolean;
  onCalendarClick: () => void;
  sliderDate: Date;
  closeDateTimePicker: () => void;
}

export default function SliderDateTimePicker(props: SliderDateTimePickerProps) {
  const {
    sliderDate,
    isDatePickerVisible,
    onCalendarClick,
    closeDateTimePicker,
  } = props;
  const [showTooltip, setShowTooltip] = useState(false);

  const { current_NUTS_LVL } = useAppSelector((state) => state.metaInfoReducer);
  const { zoom } = useAppSelector((state) => state.mapReducer);

  const shouldDisableSlider =
    zoom < stationZoomLvl && current_NUTS_LVL === NUTS_LVL.NUTS0;

  const handleTooltipToggle = (event: any) => {

    setShowTooltip(event.type === "mouseenter");
  };

  const getSliderDateString = () => {
    if (!sliderDate) return;
    return (
      (sliderDate.getDate() > 9
        ? sliderDate.getDate()
        : "0" + sliderDate.getDate()) +
      "/" +
      (sliderDate.getMonth() > 8
        ? sliderDate.getMonth() + 1
        : "0" + (sliderDate.getMonth() + 1)) +
      "/" +
      sliderDate.getFullYear() +
      " " +
      sliderDate.getHours() +
      ":" +
      sliderDate.getMinutes() +
      "0"
    );
  };

  return (
    <>
      <div className="SliderDateTimePicker__container">
        {(shouldDisableSlider || isDatePickerVisible) && (
          <div
            className="SliderDateTimePicker__containerOverlay"
            onMouseEnter={handleTooltipToggle}
            onMouseLeave={handleTooltipToggle}
          ></div>
        )}
        {showTooltip && (
          <div className="SliderDateTimePicker__tooltip">
            <p>Please zoom in or turn on choropleth mode</p>
          </div>
        )}
        <div className="SliderDateTimePicker__dateContainer">
          <div className="SliderDateTimePicker__date">
            {getSliderDateString()}
          </div>
          <button
            style={{ border: "none", background: "white", color: "black" }}
            onClick={onCalendarClick}
          >
            <img src={dateTimeIcon} alt="pause icon" />
          </button>
        </div>
      </div>

      {isDatePickerVisible && (
        <div className="SliderDateTimePicker__modal">
          <DateTimePicker onCancel={closeDateTimePicker} />
        </div>
      )}
    </>
  );
}
