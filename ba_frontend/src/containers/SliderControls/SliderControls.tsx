import * as React from "react";
import playIcon from "../../assets/svg/play.svg";
import pauseIcon from "../../assets/svg/pause.svg";
import fastForwardIcon from "../../assets/svg/fast_forward_icon.svg";
import fastBackwardIcon from "../../assets/svg/fast_backward_icon.svg";
import "./SliderControls.scss";

export interface SliderrControlsProps {
  isPlaying: boolean;
  isDatePickerVisible: boolean;
  onPlayHandler: () => void;
  onPauseHandler: () => void;
  onFastForwardHandler: () => void;
  onFastBackwardHandler: () => void;
}

export default function SliderControls(props: SliderrControlsProps) {
  const {
    isPlaying,
    isDatePickerVisible,
    onFastBackwardHandler,
    onFastForwardHandler,
    onPauseHandler,
    onPlayHandler,
  } = props;
  return (
    <div className="SliderControls">
      <button
        className="SliderControls__button"
        onClick={onFastBackwardHandler}
      >
        <img src={fastBackwardIcon} alt="pause icon" />
      </button>
      {!isPlaying && (
        <button
          className="SliderControls__button"
          disabled={isDatePickerVisible}
          onClick={onPlayHandler}
        >
          <img src={playIcon} alt="Play icon" />
        </button>
      )}
      {isPlaying && (
        <button className="SliderControls__button" onClick={onPauseHandler} >
          <img src={pauseIcon} alt="pause icon" />
        </button>
      )}
      <button
        className="SliderControls__button"
        onClick={onFastForwardHandler}
      >
        <img src={fastForwardIcon} alt="pause icon" />
      </button>
    </div>
  );
}
