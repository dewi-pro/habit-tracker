import React from 'react';

import {
  arrayRemove,
  doc,
  updateDoc,
} from 'firebase/firestore'; // Import arrayRemove for cleaner deletion

import { days } from '../data/Habits'; // Ensure this path is correct
import { db } from '../firebase'; // Ensure this path is correct

const HabitTable = ({ habits, checked, currentWeek, toggleCheckbox, setHabits, setChecked }) => { // Added setHabits, setChecked
  // Function to calculate completed days for the current week
  const calculateCompletedThisWeek = (habitIndex) => {
    const startOfDayIndex = currentWeek * days.length; // days.length should be 7
    const endOfDayIndex = startOfDayIndex + days.length;
    return checked[habitIndex]
      ?.slice(startOfDayIndex, endOfDayIndex)
      .filter(Boolean).length || 0;
  };

  const deleteHabit = async (habitNameToDelete, habitIndex) => {
    // Confirmation dialog for deletion
    if (!window.confirm(`Are you sure you want to delete "${habitNameToDelete}"?`)) {
      return; // User cancelled
    }

    const docRef = doc(db, 'habit-tracker', 'habitList');
    try {
      // Use arrayRemove to safely remove the specific habit name from the array
      await updateDoc(docRef, {
        habits: arrayRemove(habitNameToDelete),
      });

      // Update local state immediately for a snappier UI
      setHabits(prevHabits => prevHabits.filter(h => h !== habitNameToDelete));

      // Also remove the corresponding checked row from the local state
      setChecked(prevChecked => prevChecked.filter((_, idx) => idx !== habitIndex));

      alert(`Habit "${habitNameToDelete}" deleted successfully!`);
    } catch (err) {
      console.error('Error deleting habit:', err);
      alert('Failed to delete habit. Please try again.');
    }
  };

  // Optional: Edit habit functionality (placeholder for now)
  const editHabit = (habitName, habitIndex) => {
    // In a real app, this would open a modal to edit the habit name
    alert(`Edit functionality for habit "${habitName}" (Index: ${habitIndex}) coming soon!`);
    // You would likely pass a function to open a modal from HabitTracker
    // and then update the habit name in Firebase and local state.
  };

  return (
    <div className="habit-table-container"> {/* Wrapper for horizontal scrolling and styling */}
      <table className="habit-table">
        <thead>
          <tr>
            <th className="habit-name-header" rowSpan="2">Daily Habits</th> {/* Apply class for styling */}
            <th className="completed-header" rowSpan="2">Completed</th> {/* Apply class for styling */}
            <th className="days-header" colSpan={days.length}>Days</th> {/* Group day headers */}
            <th className="action-header" rowSpan="2">Action</th> {/* Apply class for styling */}
          </tr>
          <tr>
            {/* Render individual day names for the current week */}
            {days.map((day, i) => (
              <th key={`day-header-${i}`}>{day}</th> // Unique key
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.length === 0 ? (
            <tr>
              <td colSpan={days.length + 3} className="no-habits-message">
                No habits added yet. Click "Add new habit" to get started!
              </td>
            </tr>
          ) : (
            habits.map((habit, i) => (
              <tr key={`habit-row-${i}`}> {/* Unique key for row */}
                <td className="habit-name-cell">{habit}</td> {/* Apply class */}
                <td className="completed-count-cell">
                  {calculateCompletedThisWeek(i)} {/* Display count for current week */}
                </td>
                {/* Render checkboxes for each day of the current week */}
                {Array.from({ length: days.length }, (_, dIdx) => {
                  const globalDayIndex = currentWeek * days.length + dIdx;
                  return (
                    <td key={`checkbox-${i}-${dIdx}`} className="checkbox-cell"> {/* Unique key & class */}
                      <input
                        type="checkbox"
                        className="custom-checkbox" // Apply custom checkbox class
                        checked={checked[i]?.[globalDayIndex] || false}
                        onChange={() => toggleCheckbox(i, globalDayIndex)}
                      />
                    </td>
                  );
                })}
                <td className="action-icons-cell"> {/* Apply class */}
                  {/* Edit button (optional, placeholder for now) */}
                  <button
                    className="action-icon-btn edit"
                    onClick={() => editHabit(habit, i)}
                    aria-label={`Edit habit ${habit}`}
                  >
                    ✎
                  </button>
                  {/* Delete button */}
                  <button
                    className="action-icon-btn delete"
                    onClick={() => deleteHabit(habit, i)}
                    aria-label={`Delete habit ${habit}`}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTable;