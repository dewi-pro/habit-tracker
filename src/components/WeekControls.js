import React from 'react';

// REMOVE THIS IMPORT: import { numberOfWeeks } from '../data/Habits';

// Update props: remove numberOfWeeks, add calculatedNumberOfWeeks
const WeekControls = ({ currentWeek, setCurrentWeek, calculatedNumberOfWeeks, monthLabel }) => {

  const goToPreviousWeek = () => {
    setCurrentWeek((w) => Math.max(w - 1, 0));
  };

  const goToNextWeek = () => {
    // Use calculatedNumberOfWeeks here
    setCurrentWeek((w) => Math.min(w + 1, calculatedNumberOfWeeks - 1));
  };

  return (
    <div className="week-controls">
      <button
        onClick={goToPreviousWeek}
        disabled={currentWeek === 0}
        className="nav-button"
        aria-label="Previous Week"
      >
        &lt; Previous Week
      </button>
      <span className="week-indicator">
        {monthLabel}, Week {currentWeek + 1} {/* Use calculatedNumberOfWeeks */}
      </span>
      <button
        onClick={goToNextWeek}
        disabled={currentWeek === calculatedNumberOfWeeks - 1} // Use calculatedNumberOfWeeks here
        className="nav-button"
        aria-label="Next Week"
      >
        Next Week &gt;
      </button>
    </div>
  );
};

export default WeekControls;