import FocusTrap from "focus-trap-react";
import React, { useEffect } from "react";
import { Button } from "../Button/Button";
import "./Dialog.scss";

export interface IDialog {
  title: string;
  onCancelHandler: () => void;
  onSaveHandler: () => void;
  onSaveCallback?: () => void;
  className?: string;
  children?: any;
  hideButtons?: boolean;
}

export const Dialog = (props: IDialog) => {
  const { title, className, onCancelHandler } = props;
  const classes = ["Dialog", className ? className : null];

  useEffect(() => {
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  });

  const onEscape = (e: KeyboardEvent) => {
    e.key === "Escape" && onCancelHandler();
  };

  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
      <dialog className={classes.join(" ")}>
        <header className="Dialog__header">
          <h2 className="Dialog__title">{title}</h2>
        </header>
        <div className="Dialog__body">{props.children}</div>

        <footer className="Dialog__footer">
          <Button onClick={() => onCancelHandler()}>Ok</Button>
        </footer>
      </dialog>
    </FocusTrap>
  );
};
