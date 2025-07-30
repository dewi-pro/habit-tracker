import React from 'react';

import { days } from '../data/Habits';
import pots from './pots';

const WeeklyProgress = ({ checked, currentWeek }) => {
  const getDayProgress = (dayIndex) => {
    const index = currentWeek * 7 + dayIndex;
    let completed = 0;

    checked.forEach(habitRow => {
      if (habitRow[index]) completed++;
    });

    const total = checked.length || 1; // avoid division by 0
    return Math.round((completed / total) * 100);
  };

  const getStage = (percent) => {
    if (percent >= 75) return "bloom";
    if (percent >= 50) return "growing";
    if (percent >= 25) return "sprout";
    return "empty";
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Week {currentWeek + 1} Progress</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        {days.map((dayName, dayIdx) => {
          const percent = getDayProgress(dayIdx);
          const stage = getStage(percent);
          return (
            <div key={dayName} style={{ textAlign: 'center' }}>
              <strong>{dayName}</strong>
              <div style={{ marginTop: 10 }}>{pots[stage]}</div>
              <div>{percent}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgress;
