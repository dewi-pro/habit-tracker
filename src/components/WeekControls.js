import React from 'react';

import { numberOfWeeks } from '../data/Habits'; // Ensure this path is correct

const WeekControls = ({ currentWeek, setCurrentWeek }) => {
  const goToPreviousWeek = () => {
    setCurrentWeek((w) => Math.max(w - 1, 0));
  };

  const goToNextWeek = () => {
    setCurrentWeek((w) => Math.min(w + 1, numberOfWeeks - 1));
  };

  return (
    <div className="week-controls"> {/* Apply the new class name */}
      <button
        onClick={goToPreviousWeek}
        disabled={currentWeek === 0}
        className="nav-button" // Apply the consistent navigation button style
        aria-label="Previous Week"
      >
        &lt; Previous Week
      </button>
      <span className="week-indicator"> {/* Apply a class for the week indicator */}
        Week {currentWeek + 1} of {numberOfWeeks}
      </span>
      <button
        onClick={goToNextWeek}
        disabled={currentWeek === numberOfWeeks - 1}
        className="nav-button" // Apply the consistent navigation button style
        aria-label="Next Week"
      >
        Next Week &gt;
      </button>
    </div>
  );
};

export default WeekControls;