/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface IPortal {
  children: any;
  className: string;
  el: string;
}

export const Portal = ({ children, className, el }: IPortal) => {
  const [container] = useState(() => {
    // This will be executed only on the initial render
    // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    return document.createElement(el);
  });

  useEffect(() => {
    container.classList.add(className);
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return ReactDOM.createPortal(children, container);
};
