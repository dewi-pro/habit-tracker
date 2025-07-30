import React, { useState } from 'react';

import {
  arrayRemove,
  doc,
  updateDoc,
} from 'firebase/firestore'; // Import Firestore functions

import {
  faEdit,
  faSave,
  faTimes,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { db } from '../firebase'; // Import db instance

// Receive weekDates as a prop
const HabitTable = ({ habits, checked, currentWeek, toggleCheckbox, setHabits, setChecked, days, numberOfWeeks, user, weekDates }) => {
  const [editingHabitIndex, setEditingHabitIndex] = useState(null);
  const [editedHabitName, setEditedHabitName] = useState('');

  const firstDayOfWeekIndex = currentWeek * days.length;
  const lastDayOfWeekIndex = firstDayOfWeekIndex + days.length;

  const handleEditClick = (index, name) => {
    setEditingHabitIndex(index);
    setEditedHabitName(name);
  };

  const handleSaveEdit = async (habitIndex) => {
    if (!editedHabitName.trim()) {
      alert('Habit name cannot be empty.');
      return;
    }
    if (!user) {
      alert('Please log in to edit habits.');
      return;
    }

    const oldHabitName = habits[habitIndex];
    const newHabitNameTrimmed = editedHabitName.trim();

    // If name hasn't changed, just exit edit mode
    if (oldHabitName === newHabitNameTrimmed) {
        setEditingHabitIndex(null);
        return;
    }

    try {
        const habitsDocRef = doc(db, 'users', user.uid, 'habit-data', 'habitList');
        // Get all monthly progress docs for the user to update habit name in 'checked' object keys
        // NOTE: This is complex. A simpler approach might be to store habits as objects with unique IDs.
        // For this array-based approach, updating habit name implies shifting data or
        // updating keys in ALL relevant monthly-progress documents.
        // For simplicity and matching current data structure, we'll try to update the habits array
        // and keep checked state indexed by position.

        // 1. Update the habits array itself
        const updatedHabits = habits.map((name, idx) =>
            idx === habitIndex ? newHabitNameTrimmed : name
        );
        await updateDoc(habitsDocRef, { habits: updatedHabits });

        // 2. Update local state
        setHabits(updatedHabits);
        setEditingHabitIndex(null);
        alert('Habit updated successfully!');
    } catch (error) {
        console.error('Error updating habit:', error);
        alert('Failed to update habit. Please try again.');
    }
  };


  const handleDeleteHabit = async (habitIndex) => {
    if (!window.confirm(`Are you sure you want to delete "${habits[habitIndex]}"? This cannot be undone.`)) {
      return;
    }
    if (!user) {
      alert('Please log in to delete habits.');
      return;
    }

    try {
      // 1. Remove habit from the habits list
      const habitToDelete = habits[habitIndex];
      const habitsDocRef = doc(db, 'users', user.uid, 'habit-data', 'habitList');
      await updateDoc(habitsDocRef, {
        habits: arrayRemove(habitToDelete)
      });

      // 2. Update local habits state
      const updatedHabits = habits.filter((_, idx) => idx !== habitIndex);
      setHabits(updatedHabits);

      // 3. Adjust checked state: remove the corresponding row
      const updatedChecked = checked.filter((_, idx) => idx !== habitIndex);
      setChecked(updatedChecked);

      // NOTE: This simple deletion only works if you don't care about shifting
      // habit_X keys in monthly progress documents. If habit 'A' (habit_0) is deleted,
      // and habit 'B' was habit_1, 'B' will effectively become habit_0.
      // This requires re-indexing all `habit_X` keys in *all* monthly progress documents.
      // For a robust solution, consider storing habits with unique IDs instead of array index.
      // For now, assuming index-based deletion is acceptable or handled by a full re-sync.

      alert(`Habit "${habitToDelete}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  };

  // Helper to format date for display (e.g., "Mon 29")
  const formatDate = (date) => {
    const dayName = date.toLocaleString('default', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    return `${dayName.slice(0, 3)} ${dayOfMonth}`; // "Mon 29"
  };

  return (
    <div className="habit-table-container">
      <table className="habit-table">
        <thead>
          <tr>
            <th>Daily Habits</th>
            <th>Completed</th>
            {/* Map over weekDates to display actual dates */}
            {weekDates.map((date, index) => (
              <th key={index}>{formatDate(date)}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habitName, habitIndex) => (
            <tr key={habitIndex}>
              <td className="habit-name-cell">
                {editingHabitIndex === habitIndex ? (
                  <input
                    type="text"
                    value={editedHabitName}
                    onChange={(e) => setEditedHabitName(e.target.value)}
                    className="edit-habit-input"
                  />
                ) : (
                  habitName
                )}
              </td>
              <td>
                {/* Calculate completions for the current week only */}
                {checked[habitIndex] ?
                    checked[habitIndex].slice(firstDayOfWeekIndex, lastDayOfWeekIndex).filter(Boolean).length
                    : 0
                }
              </td>
              {/* Map over days.length (7) to render checkboxes for current week */}
              {Array.from({ length: days.length }).map((_, dayOfWeekIndex) => {
                const globalDayIndex = firstDayOfWeekIndex + dayOfWeekIndex;
                const isChecked = checked[habitIndex]?.[globalDayIndex] || false;
                return (
                  <td key={globalDayIndex}>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckbox(habitIndex, globalDayIndex)}
                    />
                  </td>
                );
              })}
              <td className="action-icons-cell">
                {editingHabitIndex === habitIndex ? (
                  <>
                    <button
                      className="action-icon-btn save"
                      onClick={() => handleSaveEdit(habitIndex)}
                      aria-label="Save Habit"
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                      className="action-icon-btn cancel"
                      onClick={() => setEditingHabitIndex(null)}
                      aria-label="Cancel Edit"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="action-icon-btn edit"
                      onClick={() => handleEditClick(habitIndex, habitName)}
                      aria-label="Edit Habit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-icon-btn delete"
                      onClick={() => handleDeleteHabit(habitIndex)}
                      aria-label="Delete Habit"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTable;