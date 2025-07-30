import React from 'react';

import { days } from '../data/Habits';
import pots from './pots'; // Keep this import now

const WeeklyProgress = ({ checked, currentWeek }) => {
  // Helper to get daily progress percentage
  const getDayProgress = (dayIndex) => {
    // Calculate the global index for the specific day in the checked array
    const globalDayIndex = currentWeek * days.length + dayIndex;
    let completedCount = 0;

    // Iterate through each habit row to count completions for this specific day
    checked.forEach(habitRow => {
      // Ensure habitRow and its index exist before checking
      if (habitRow && habitRow[globalDayIndex]) {
        completedCount++;
      }
    });

    const totalHabits = checked.length;
    // Avoid division by zero if no habits are added
    if (totalHabits === 0) {
      return 0;
    }

    return Math.round((completedCount / totalHabits) * 100);
  };

  // Helper to map percentage to a string stage key for the `pots` object
  const getStageKey = (percent) => {
    if (percent >= 75) return "bloom";
    if (percent >= 50) return "growing";
    if (percent >= 25) return "sprout";
    return "empty";
  };

  return (
    <div className="weekly-progress-section">
      <h2 className="section-title">Week {currentWeek + 1} Progress</h2>
      <div className="progress-grid">
        {days.map((dayName, dayIdx) => {
          const percent = getDayProgress(dayIdx);
          const stageKey = getStageKey(percent); // Get string key for `pots` object

          return (
            <div key={`day-progress-${dayIdx}`} className="daily-progress-card">
              <span className="day-label">{dayName}</span>
              <div className="plant-container">
                {/* Render the SVG directly from the pots object */}
                {/* The `pot` class will now be styled on the parent `plant-container` or directly on the SVG/rects */}
                {pots[stageKey]}
              </div>
              <span className="percentage">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgress;