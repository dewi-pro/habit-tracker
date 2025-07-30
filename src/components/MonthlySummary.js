import React from 'react';

// Assuming days and numberOfWeeks are passed for comprehensive summary calculation
const MonthlySummary = ({ habits, checked, days, numberOfWeeks }) => {
  // If no habits or checked data, don't render the section
  if (!habits.length || !checked.length) {
    return null;
  }

  // Helper to calculate total possible days for the month
  // This assumes 'checked' array for each habit covers the entire month
  const totalDaysInMonth = numberOfWeeks * days.length;

  const getPercentage = (habitCheckedRow) => {
    if (!habitCheckedRow || habitCheckedRow.length === 0) {
      return 0; // Avoid division by zero
    }
    const completedCount = habitCheckedRow.filter(Boolean).length;
    return Math.round((completedCount / totalDaysInMonth) * 100);
  };

  return (
    <div className="monthly-summary-section"> {/* Apply the main section class */}
      <h2 className="section-title">Monthly Habit Summary</h2> {/* Use the consistent section title class */}
      <div className="summary-list"> {/* A container for the list of summary items */}
        {habits.map((habit, i) => (
          <div key={`monthly-summary-${i}`} className="summary-item"> {/* Apply class for each summary item */}
            <div className="summary-item-header"> {/* Header for habit name and percentage */}
              <span className="habit-name-summary">{habit}</span> {/* Apply class for habit name */}
              <span className="summary-percentage">{getPercentage(checked[i])}%</span> {/* Apply class for percentage */}
            </div>
            <div className="progress-bar-container"> {/* Container for the progress bar track */}
              <div
                className="progress-bar-fill" // Apply class for the progress bar fill
                style={{ width: `${getPercentage(checked[i])}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlySummary;