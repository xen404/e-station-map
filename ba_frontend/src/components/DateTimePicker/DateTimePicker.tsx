import React, { InputHTMLAttributes, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { metaInfoSlice } from "../../services/slices/metaInfo";
import { Button } from "../Button/Button";
import "./DateTimePicker.scss";
export interface ICheckbox extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  children: any;
}

interface Iprops {
  onCancel?: () => void;
}

export const DateTimePicker = (props: Iprops) => {
  const { onCancel } = props;
  const dispatch = useAppDispatch();

  const [date, setDate] = useState<string>("2022-04-10");
  const [time, setTime] = useState<string>("10:00");

  const onDateTimeSubmit = () => {
    const newCurrentDate = new Date(`${date}T${time}`);

    dispatch(metaInfoSlice.actions.setCurrentDate(newCurrentDate));
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };
  const onTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };
  return (
    <>
      <div className="DateTimePicker">
        <div className="DateTimePicker__datepicker">
          <label
            className="DateTimePicker__datepickerLabel"
            htmlFor="birthday"
          ></label>
          <input
            className="DateTimePicker__datepickerInput"
            type="date"
            min="2022-03-03"
            max="2022-04-30"
            id="birthday"
            name="birthday"
            value={date}
            onChange={onDateChange}
          />
        </div>
        <div className="DateTimePicker__timepicker">
          <label
            className="DateTimePicker__timepickerLabel"
            htmlFor="appt"
          ></label>
          <input
            className="DateTimePicker__timepickerInput"
            type="time"
            id="appt"
            name="appt"
            required
            value={time}
            onChange={onTimeChange}
          />
          <Button style={{ minWidth: "140px"}} onClick={onDateTimeSubmit}>Submit</Button>
          {onCancel && <button className="DateTimePicker__closeBtn" onClick={onCancel}>X</button>}
        </div>
      </div>
    </>
  );
};
