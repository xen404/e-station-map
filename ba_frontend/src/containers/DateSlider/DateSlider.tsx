import Slider from "rc-slider";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import "./DateSlider.scss";
import "rc-slider/assets/index.css";
import { metaInfoSlice } from "../../services/slices/metaInfo";
import { useGetNutsQuery } from "../../services/enpoints/nuts";
import SliderControls from "../SliderControls/SliderControls";
import SliderDateTimePicker from "../SliderDateTimePicker/SliderDateTimePicker";
import { useGetEstationsInBoundsQuery } from "../../services/enpoints/eStation";
import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import { NUTS_LVL } from "../../constants/enums";
import { LoadingIndicator } from "../../components/LoadingIndicator/LoadingIndicator";

export interface IDateSlider {
  station: any;
  onCancelHandler: () => void;
}

const START_DATE = "2022-03-03T00:00";
const SLIDER_MAX_VALUE = 1415;

export const DateSlider = () => {
  const dispatch = useAppDispatch();
  const map = useMap();

  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [currentTimeIncrementer, setCurrentTimeIncrementer] = useState(6);
  const [currentMaxBounds, setCurrentMaxBounds] = useState<LatLngBounds>();

  const { current_NUTS_LVL, currentDate } = useAppSelector(
    (state) => state.metaInfoReducer
  );
  const { bounds } = useAppSelector((state) => state.mapReducer);

  const { isError: isErrorNUTS, isFetching: isFetchingNUTS } = useGetNutsQuery(
    {
      nutsLvl: current_NUTS_LVL,
      date: currentDate,
    },
    {
      skip: current_NUTS_LVL === NUTS_LVL.NUTS0,
    }
  );
  const { isFetching: isFetchingStations, isError: isErrorStations } =
    useGetEstationsInBoundsQuery({
      bounds: currentMaxBounds!,
      date: currentDate,
    });
  const [sliderDate, setSliderDate] = useState<Date>(
    new Date("2022-03-03T00:00")
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (
          !isErrorNUTS &&
          !isFetchingNUTS &&
          !isErrorStations &&
          !isFetchingStations
        ) {
          const date = sliderDate;
          const selectedDate = new Date(
            date.setHours(date.getHours() + currentTimeIncrementer)
          );

          if (sliderValue + currentTimeIncrementer >= SLIDER_MAX_VALUE) {
            onPauseHandler();
            return;
          }
          setSliderValue(sliderValue + currentTimeIncrementer);
          dispatch(metaInfoSlice.actions.setCurrentDate(selectedDate));
        }
      }, 1000);
    } else {
      clearInterval(intervalId!!);
    }
    return () => clearInterval(intervalId);
  }, [
    isPlaying,
    isErrorNUTS,
    isFetchingNUTS,
    isErrorStations,
    isFetchingStations,
    currentTimeIncrementer,
  ]);

  useEffect(() => {
    if (!isDatePickerVisible) return;
    const startDate = new Date(START_DATE);
    const elapsedTime = currentDate.getTime() - startDate.getTime(); // elapsed time in milliseconds
    const elapsedHours = elapsedTime / (1000 * 60 * 60);

    setSliderValue(elapsedHours);
  }, [currentDate]);

  useEffect(() => {
    if (bounds) {
      setCurrentMaxBounds(map.getBounds());
    }
  }, [map, bounds]);

  const onSliderChange = (e: any) => {
    if (e >= SLIDER_MAX_VALUE) {
      onPauseHandler();
    }
    setSliderValue(e);
    const date = new Date(START_DATE);
    const selectedDate = new Date(date.setHours(date.getHours() + e));
    setSliderDate(selectedDate);
  };

  const onHandleRelease = (e: any) => {
    dispatch(metaInfoSlice.actions.setCurrentDate(sliderDate));
    setSliderValue(e);
  };

  const onDragStart = (e: any) => {
    setIsPlaying(false);
  };

  const onPlayHandler = useCallback(() => {
    if (isDatePickerVisible) {
      return;
    }
    setCurrentTimeIncrementer(6);
    setIsPlaying(true);
  }, [isPlaying, isDatePickerVisible]);

  const onPauseHandler = () => {
    setIsPlaying(false);
  };

  const onFastForwardHandler = () => {
    setIsPlaying(true);
    if (currentTimeIncrementer < 0) {
      setCurrentTimeIncrementer(6);
      return;
    }
    if (currentTimeIncrementer >= 24) {
      setCurrentTimeIncrementer(6);
    } else {
      setCurrentTimeIncrementer(currentTimeIncrementer * 2);
    }
  };

  const onFastBackwardHandler = () => {
    setIsPlaying(true);
    if (currentTimeIncrementer > 0) {
      setCurrentTimeIncrementer(-6);
      return;
    }
    if (currentTimeIncrementer <= -24) {
      setCurrentTimeIncrementer(-6);
    } else {
      setCurrentTimeIncrementer(currentTimeIncrementer * 2);
    }
  };

  const onDateClick = () => {
    onPauseHandler();
    setIsDatePickerVisible(!isDatePickerVisible);
  };
  const closeModal = () => {
    setIsDatePickerVisible(false);
  };

  return (
    <div className="DateSlider__container">
      <SliderDateTimePicker
        isDatePickerVisible={isDatePickerVisible}
        sliderDate={sliderDate}
        closeDateTimePicker={closeModal}
        onCalendarClick={onDateClick}
      />
      <div className="DateSlider__slider">
        <Slider
          defaultValue={0}
          trackStyle={{ backgroundColor: "rgb(94,94,94)", height: 8 }}
          handleStyle={{
            borderColor: "black",
            height: 16,
            width: 16,
            backgroundColor: "black",
          }}
          railStyle={{ backgroundColor: "rgb(220,220,220)", height: 8 }}
          onChange={onSliderChange}
          min={0}
          max={SLIDER_MAX_VALUE}
          value={sliderValue}
          onAfterChange={onHandleRelease}
          onBeforeChange={onDragStart}
        />
      </div>
      <SliderControls
        isPlaying={isPlaying}
        isDatePickerVisible={isDatePickerVisible}
        onPlayHandler={onPlayHandler}
        onPauseHandler={onPauseHandler}
        onFastForwardHandler={onFastForwardHandler}
        onFastBackwardHandler={onFastBackwardHandler}
      />
      {(isFetchingNUTS || isFetchingStations) && (
        <div className="DateSlider__spinner">
          <LoadingIndicator isInline />
        </div>
      )}
      <div className="DateSlider__startMark">
        <p>03/03/2022</p>
        <p>00:00</p>
      </div>
      <div className="DateSlider__endMark">
        <p>30/04/2022</p>
        <p>00:00</p>
      </div>
    </div>
  );
};
