import React from 'react';

import { days } from '../data/Habits';
import pots from './pots'; // Correct import for your pots object

// Accept progressGridRef as a prop
const WeeklyProgress = ({ checked, currentWeek, weekDates, progressGridRef }) => {

  const firstDayOfWeekIndex = currentWeek * days.length;

  const calculateDailyPercentage = (dayGlobalIndex) => {
    let completedCount = 0;
    // We can directly use checked.length here for total habits,
    // assuming 'checked' always contains an array for each habit,
    // even if it's all false or empty.
    const totalHabits = checked.length; // FIX: Define totalHabits here

    checked.forEach((habitRow) => {
      if (habitRow && typeof habitRow[dayGlobalIndex] !== 'undefined') {
        // totalHabitsForDay++; // Removed, as we're using checked.length for total
        if (habitRow[dayGlobalIndex]) {
          completedCount++;
        }
      }
    });

    if (totalHabits === 0) { // Now 'totalHabits' is defined
      return 0;
    }
    return Math.round((completedCount / totalHabits) * 100);
  };

  const getStageKey = (percent) => {
    if (percent === 100) return "bloom";
    if (percent >= 75) return "bud";
    if (percent >= 50) return "growing";
    if (percent >= 25) return "sprout";
    if (percent > 0) return "sprout";
    return "empty";
  };

  const getProgressColor = (percent) => {
    if (percent === 100) return "#FFD700";
    if (percent >= 75) return "#FF69B4";
    if (percent >= 50) return "#6B8E23";
    if (percent >= 25) return "#8BC34A";
    if (percent > 0) return "#8BC34A";
    return "#888";
  };

  const formatDateForProgress = (date) => {
    const dayName = date.toLocaleString('default', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    return `${dayName.slice(0, 3)} ${dayOfMonth}`;
  };

  return (
    <div className="weekly-progress-section">
      <h2 className="section-title">Week {currentWeek + 1} Progress</h2>
      {/* Attach the progressGridRef to the .progress-grid div */}
      <div className="progress-grid" ref={progressGridRef}>
        {weekDates.map((date, dayOfWeekIndex) => {
          const globalDayIndex = firstDayOfWeekIndex + dayOfWeekIndex;
          const percentage = calculateDailyPercentage(globalDayIndex);
          const stageKey = getStageKey(percentage);
          const progressColor = getProgressColor(percentage);

          return (
            <div className="daily-progress-card" key={globalDayIndex}>
              <div className="day-label">{formatDateForProgress(date)}</div>
              <div className="plant-container">
                 {pots[stageKey]}
              </div>
              <div className="percentage" style={{ color: progressColor }}>
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgress;