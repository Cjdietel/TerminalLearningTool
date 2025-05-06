// seagullCommand.jsx
import React from 'react';
import seagullSrc from '../assets/seagull.png'; 


let nextId = 0;

export default function seagullCommand(args, { addOutput }) {
  const id = `seagull-${nextId++}`;
  addOutput(<FlyingSeagull key={id} />);
}

export const seagullMan = () => `
    seagull: Caw caw.

    Usage: seagull

    Description: Shhh its a secret.

    Example: seagull

`;

import '../seagull.css';

export function FlyingSeagull() {
  return (
    <div className="seagull-container">
      <img
        src={seagullSrc}
        alt="Seagull flying"
        className="seagull"
      />
    </div>
  );
}
