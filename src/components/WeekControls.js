import React from 'react';

import { numberOfWeeks } from '../data/Habits';

const WeekControls = ({ currentWeek, setCurrentWeek }) => {
  const goToPreviousWeek = () => {
    setCurrentWeek((w) => Math.max(w - 1, 0));
  };

  const goToNextWeek = () => {
    setCurrentWeek((w) => Math.min(w + 1, numberOfWeeks - 1));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={goToPreviousWeek} disabled={currentWeek === 0}>
        ◀️ Previous Week
      </button>
      <span style={{ margin: '0 10px' }}>
        Week {currentWeek + 1} of {numberOfWeeks}
      </span>
      <button onClick={goToNextWeek} disabled={currentWeek === numberOfWeeks - 1}>
        Next Week ▶️
      </button>
    </div>
  );
};

export default WeekControls;
