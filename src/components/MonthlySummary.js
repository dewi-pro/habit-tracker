import './MonthlySummary.css'; // optional styling

import React from 'react';

const MonthlySummary = ({ habits, checked }) => {
  if (!habits.length || !checked.length) return null;

  const getPercentage = (row) =>
    Math.round((row.filter(Boolean).length / row.length) * 100);

  return (
    <div className="MonthlySummary">
      <h2>📊 Monthly Habit Summary</h2>
      <ul>
        {habits.map((habit, i) => (
          <li key={i}>
            <strong>{habit}:</strong>
            <div className="progress-bar">
              <div
                className="fill"
                style={{ width: `${getPercentage(checked[i])}%` }}
              ></div>
            </div>
            <span>{getPercentage(checked[i])}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlySummary;
