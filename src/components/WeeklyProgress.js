import React from 'react';

import { days } from '../data/Habits';
import pots from './pots'; // Ensure this path is correct now

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
  // NEW LOGIC FOR 0%, <25%, >=25%, >=50%, >=75%, 100%
  const getStageKey = (percent) => {
    if (percent === 100) return "bloom"; // Fully bloomed at 100%
    if (percent >= 75) return "bud";    // Bud stage from 75% up to 99%
    if (percent >= 50) return "growing"; // Growing stage from 50% up to 74%
    if (percent >= 25) return "sprout";  // Sprout stage from 25% up to 49%
    if (percent > 0) return "sprout";   // If >0 but less than 25%, still a sprout, perhaps a smaller one if you made one
    return "empty";                     // 0% or no habits
  };

  // Helper to determine the color for the percentage text and potential progress bar (if added)
  const getProgressColor = (percent) => {
    if (percent === 100) return "#FFD700"; // Gold/Yellow for 100% bloom
    if (percent >= 75) return "#FF69B4";    // Hot pink for bud
    if (percent >= 50) return "#6B8E23";    // Darker green for growing
    if (percent >= 25) return "#8BC34A";    // Lighter green for sprout
    if (percent > 0) return "#8BC34A";      // Still sprout green
    return "#888";                          // Grey for 0%
  };

  return (
    <div className="weekly-progress-section">
      <h2 className="section-title">Week {currentWeek + 1} Progress</h2>
      <div className="progress-grid">
        {days.map((dayName, dayIdx) => {
          const percent = getDayProgress(dayIdx);
          const stageKey = getStageKey(percent); // Get string key for `pots` object
          const progressColor = getProgressColor(percent); // Get color for display

          return (
            <div key={`day-progress-${dayIdx}`} className="daily-progress-card">
              <span className="day-label">{dayName}</span>
              <div className="plant-container">
                {/* Render the SVG directly from the pots object */}
                {pots[stageKey]}
              </div>
              <span className="percentage" style={{ color: progressColor }}>
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgress;