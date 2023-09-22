import React from 'react';
import './Fieldset.scss';

export interface IFieldset {
  legend: string;
  options: {
    label: string;
    value: string;
    checked?: boolean;
    disabled: boolean;
  }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Fieldset = (props: IFieldset) => {
  const { legend, options, onChange } = props;

  const generateOptions = options.map(({ label, value, checked, disabled }) => {
    return (
      <React.Fragment key={value}>
        <input
          className="Fieldset__input"
          type="radio"
          id={value}
          value={value}
          name={legend}
          defaultChecked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <label className="Fieldset__label" htmlFor={value}>
          {label}
        </label>
      </React.Fragment>
    );
  });

  return (
    <fieldset className="Fieldset">
      <legend className="sr-only">{legend}</legend>
      {generateOptions}
    </fieldset>
  );
};
