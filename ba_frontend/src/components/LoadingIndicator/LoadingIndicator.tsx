import React from 'react';
import './LoadingIndicator.scss';

export interface ILoadingIndicator {
  isWhite?: boolean;
  isInline?: boolean;
  isLarge?: boolean;
}
export const LoadingIndicator = (props: ILoadingIndicator) => {
  const { isWhite, isInline, isLarge=false } = props;

  const classes = [
    'LoadingIndicator',
    isInline ? 'LoadingIndicator--inline' : null,
  ];
  const indicatorClasses = [
    'LoadingIndicator__indicator',
    isWhite && isLarge ? 'LoadingIndicator__indicator--whiteLarge' : null,
    isWhite ? 'LoadingIndicator__indicator--white' : null,
    isInline ? 'LoadingIndicator__indicator--inline' : null,
  ];

  return (
    <div className={classes.join(' ')}>
      <div className={indicatorClasses.join(' ')} aria-live="polite">
        <span className="sr-only">Inhalt wird geladen</span>
      </div>
    </div>
  );
};
