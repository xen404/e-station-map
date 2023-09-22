import React, { HTMLAttributes } from 'react';
import './Button.scss';

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  children: any;
}

export const Button = (props: IButton) => {
  const { children, primary, ...rest } = props;

  const classes = ['Button', primary ? 'Button--primary' : null];

  return (
    <button className={classes.join(' ')} {...rest}>
      {props.children}
    </button>
  );
};
