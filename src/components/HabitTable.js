import React, { useState } from 'react'; // Import useState

import {
  arrayRemove,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import { days } from '../data/Habits'; // Ensure this path is correct
import { db } from '../firebase'; // Ensure this path is correct

const HabitTable = ({ habits, checked, currentWeek, toggleCheckbox, setHabits, setChecked }) => {
  // New state for editing
  const [editingHabitIndex, setEditingHabitIndex] = useState(null);
  const [editedHabitName, setEditedHabitName] = useState('');

  // Function to calculate completed days for the current week
  const calculateCompletedThisWeek = (habitIndex) => {
    const startOfDayIndex = currentWeek * days.length; // days.length should be 7
    const endOfDayIndex = startOfDayIndex + days.length;
    return checked[habitIndex]
      ?.slice(startOfDayIndex, endOfDayIndex)
      .filter(Boolean).length || 0;
  };

  const deleteHabit = async (habitNameToDelete, habitIndex) => {
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

  // --- NEW: Edit Habit Functions ---
  const startEditingHabit = (habitName, index) => {
    setEditingHabitIndex(index);
    setEditedHabitName(habitName);
  };

  const saveEditedHabit = async (originalHabitName, habitIndex) => {
    if (!editedHabitName.trim()) {
      alert('Habit name cannot be empty.');
      return;
    }
    if (editedHabitName === originalHabitName) {
      cancelEditingHabit(); // No change, just cancel
      return;
    }
    if (habits.includes(editedHabitName)) {
      alert('A habit with this name already exists.');
      return;
    }

    const docRef = doc(db, 'habit-tracker', 'habitList');
    try {
      const habitsSnap = await getDoc(docRef);
      if (habitsSnap.exists()) {
        const currentHabits = habitsSnap.data().habits || [];
        const updatedHabits = [...currentHabits]; // Create a mutable copy

        // Find the index of the original habit name in the Firestore array
        // This is important because the local 'habits' state might not exactly match
        // the order if multiple users are editing or data gets out of sync briefly.
        // For simplicity with array updates, we'll use the passed habitIndex for now,
        // but finding by value is more robust in a real-time scenario.
        updatedHabits[habitIndex] = editedHabitName; // Update at the specific index

        await updateDoc(docRef, { habits: updatedHabits });

        // Update local state
        setHabits(updatedHabits); // The entire array is updated
        alert(`Habit "${originalHabitName}" renamed to "${editedHabitName}"!`);
      }

      // Reset editing state
      cancelEditingHabit();
    } catch (err) {
      console.error('Error updating habit:', err);
      alert('Failed to update habit. Please try again.');
    }
  };

  const cancelEditingHabit = () => {
    setEditingHabitIndex(null);
    setEditedHabitName('');
  };
  // --- END NEW: Edit Habit Functions ---


  return (
    <div className="habit-table-container">
      <table className="habit-table">
        <thead>
          <tr>
            <th className="habit-name-header" rowSpan="2">Daily Habits</th>
            <th className="completed-header" rowSpan="2">Completed</th>
            <th className="days-header" colSpan={days.length}>Days</th>
            <th className="action-header" rowSpan="2">Action</th>
          </tr>
          <tr>
            {/* Render individual day names for the current week */}
            {days.map((day, i) => (
              <th key={`day-header-${i}`}>{day}</th>
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
              <tr key={`habit-row-${i}`}>
                {editingHabitIndex === i ? (
                  // Render input field when editing
                  <td className="habit-name-cell edit-mode">
                    <input
                      type="text"
                      value={editedHabitName}
                      onChange={(e) => setEditedHabitName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // Prevent form submission
                          saveEditedHabit(habit, i);
                        }
                        if (e.key === 'Escape') {
                          cancelEditingHabit();
                        }
                      }}
                      className="edit-habit-input"
                    />
                  </td>
                ) : (
                  // Render habit name normally
                  <td className="habit-name-cell">{habit}</td>
                )}
                <td>{calculateCompletedThisWeek(i)}</td>
                {Array.from({ length: 7 }, (_, dIdx) => {
                  const globalDayIndex = currentWeek * 7 + dIdx;
                  return (
                    <td key={`checkbox-${i}-${dIdx}`} className="checkbox-cell">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={checked[i]?.[globalDayIndex] || false}
                        onChange={() => toggleCheckbox(i, globalDayIndex)}
                        disabled={editingHabitIndex === i} // Disable checkboxes when editing
                      />
                    </td>
                  );
                })}
                <td className="action-icons-cell">
                  {editingHabitIndex === i ? (
                    // Show Save/Cancel buttons when editing
                    <>
                      <button
                        className="action-icon-btn save"
                        onClick={() => saveEditedHabit(habit, i)}
                        aria-label="Save habit name"
                      >
                        ✔️
                      </button>
                      <button
                        className="action-icon-btn cancel"
                        onClick={cancelEditingHabit}
                        aria-label="Cancel editing"
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    // Show Edit/Delete buttons normally
                    <>
                      <button
                        className="action-icon-btn edit"
                        onClick={() => startEditingHabit(habit, i)}
                        aria-label={`Edit habit ${habit}`}
                      >
                        ✎
                      </button>
                      <button
                        className="action-icon-btn delete"
                        onClick={() => deleteHabit(habit, i)}
                        aria-label={`Delete habit ${habit}`}
                      >
                        🗑️
                      </button>
                    </>
                  )}
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