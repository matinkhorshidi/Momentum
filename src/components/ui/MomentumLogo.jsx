import React from 'react';

const MomentumLogo = ({ className = '' }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Momentum Logo</title>
    <rect
      style={{ fill: '#bb86fc' }}
      x="15"
      y="55"
      width="20"
      height="35"
      rx="4"
    ></rect>
    <rect
      style={{ fill: '#bb86fc' }}
      x="40"
      y="35"
      width="20"
      height="55"
      rx="4"
    ></rect>
    <rect
      style={{ fill: '#bb86fc' }}
      x="65"
      y="15"
      width="20"
      height="75"
      rx="4"
    ></rect>
  </svg>
);

export default MomentumLogo;
