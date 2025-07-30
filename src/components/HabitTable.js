import React from 'react';

import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import { days } from '../data/Habits';
import { db } from '../firebase';

const HabitTable = ({ habits, checked, currentWeek, toggleCheckbox, refreshHabits }) => {
  const deleteHabit = async (habitToDelete) => {
    const docRef = doc(db, 'habit-tracker', 'habitList');
    try {
      const habitsSnap = await getDoc(docRef);
      if (habitsSnap.exists()) {
        const current = habitsSnap.data().habits || [];
        const updated = current.filter(h => h !== habitToDelete);

        await updateDoc(docRef, { habits: updated });
        alert('Habit deleted!');
        if (typeof refreshHabits === 'function') refreshHabits(); // Optional: re-fetch data
      }
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th rowSpan="2">Daily Habits</th>
          <th rowSpan="2">Completed</th>
          {days.map((day, i) => (
            <th key={day + i}>{day}</th>
          ))}
          <th rowSpan="2">Action</th>
        </tr>
      </thead>
      <tbody>
        {habits.map((habit, i) => (
          <tr key={i}>
            <td>{habit}</td>
            <td>{checked[i]?.slice(currentWeek * 7, currentWeek * 7 + 7).filter(Boolean).length || 0}</td>
            {Array.from({ length: 7 }, (_, dIdx) => {
              const globalDayIndex = currentWeek * 7 + dIdx;
              return (
                <td key={dIdx}>
                  <input
                    type="checkbox"
                    checked={checked[i]?.[globalDayIndex] || false}
                    onChange={() => toggleCheckbox(i, globalDayIndex)}
                  />
                </td>
              );
            })}
            <td>
              <button onClick={() => deleteHabit(habit)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HabitTable;
