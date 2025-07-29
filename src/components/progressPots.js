import React from 'react';

import pots from './pots'; // assuming the SVG object above is saved as pots.js

function ProgressPot({ progressPercentage }) {
  let stage = "empty";
  if (progressPercentage >= 75) stage = "bloom";
  else if (progressPercentage >= 50) stage = "growing";
  else if (progressPercentage >= 25) stage = "sprout";

  return (
    <div className="progress-visual" style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Today's Progress: {progressPercentage}%</h2>
      {pots[stage]}
    </div>
  );
}

export default ProgressPot;
