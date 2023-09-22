import React, { InputHTMLAttributes } from 'react';
import './Checkbox.scss';
export interface ICheckbox extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  children: any;
}

export const Checkbox = (props: ICheckbox) => {
  const { id, children, ...rest } = props;

  return (
    <div className="Checkbox">
      <input className="Checkbox__input" type="checkbox" id={id} {...rest} />
      <label className="Checkbox__label" htmlFor={id}>
        {children}
      </label>
    </div>
  );
};
