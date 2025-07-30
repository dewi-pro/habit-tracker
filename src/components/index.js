import './habitTracker.css';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  days,
  numberOfWeeks,
} from '../data/Habits';
import { db } from '../firebase';
import HabitTable from './HabitTable';
import MonthlySummary from './MonthlySummary';
import WeekControls from './WeekControls';
import WeeklyProgress from './WeeklyProgress';

const HabitTracker = () => {
  const today = new Date();
  const [habits, setHabits] = useState([]);
  const [checked, setChecked] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [newHabit, setNewHabit] = useState('');
  const [currentMonthYear, setCurrentMonthYear] = useState(
    `${today.getFullYear()}_${String(today.getMonth() + 1).padStart(2, '0')}`
  );

  // 🔁 Load habits + checked state for selected month
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get habit list
        const habitsDoc = await getDoc(doc(db, 'habit-tracker', 'habitList'));
        const habitsData = habitsDoc.exists() ? habitsDoc.data().habits : [];
        setHabits(habitsData);

        // 2️⃣ Get monthly progress data
        const progressDoc = await getDoc(
          doc(db, 'habit-tracker', `user1_${currentMonthYear}`)
        );
        const progressData = progressDoc.exists() ? progressDoc.data() : {};

        const loadedChecked = habitsData.map((_, i) =>
          progressData.checked?.[`habit_${i}`] ||
          Array(numberOfWeeks * days.length).fill(false)
        );

        setChecked(loadedChecked);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, [currentMonthYear]);

  // ➕ Add new habit
  const addHabit = async (newHabitName) => {
  const docRef = doc(db, 'habit-tracker', 'habitList');
  try {
    await updateDoc(docRef, {
      habits: arrayUnion(newHabitName),
    });

    // Re-fetch updated habit list
    const updatedDoc = await getDoc(docRef);
    const updatedHabits = updatedDoc.exists() ? updatedDoc.data().habits : [];
    setHabits(updatedHabits);

    // Extend checked with a new row for the new habit
    setChecked((prev) => [
      ...prev,
      Array(numberOfWeeks * days.length).fill(false),
    ]);

    alert('Habit added!');
  } catch (err) {
    console.error('Error adding habit:', err);
  }
};

  // ✅ Toggle checkbox for habit/day
  const toggleCheckbox = (habitIndex, dayIndex) => {
    const updated = checked.map((row, i) =>
      i === habitIndex
        ? row.map((val, j) => (j === dayIndex ? !val : val))
        : row
    );
    setChecked(updated);
  };

  // 💾 Save monthly progress to Firebase
  const saveDataToFirebase = async () => {
    try {
      const checkedObj = {};
      checked.forEach((row, i) => {
        checkedObj[`habit_${i}`] = row;
      });
      await setDoc(
        doc(db, 'habit-tracker', `user1_${currentMonthYear}`),
        {
          checked: checkedObj,
        }
      );
      alert('Data saved to Firebase!');
    } catch (e) {
      console.error('Error saving document: ', e);
    }
  };

  // 📅 Change selected month
  const changeMonth = (offset) => {
    const [year, month] = currentMonthYear.split('_').map(Number);
    const newDate = new Date(year, month - 1 + offset);
    const newMonthYear = `${newDate.getFullYear()}_${String(
      newDate.getMonth() + 1
    ).padStart(2, '0')}`;
    setCurrentMonthYear(newMonthYear);
    setCurrentWeek(0); // reset to week 1 on month change
  };

  // 🗓️ Format current month label
  const monthLabel = new Date(
    currentMonthYear.split('_')[0],
    currentMonthYear.split('_')[1] - 1
  ).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="HabitTracker">
      <h1>
        Daily Habits - {monthLabel}, Week {currentWeek + 1}
      </h1>

      {/* ➕ Add new habit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newHabit.trim()) {
            addHabit(newHabit.trim());
            setNewHabit('');
          }
        }}
      >
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add new habit"
        />
        <button type="submit">➕ Add</button>
      </form>

      {/* 📅 Month Controls */}
      <div className="MonthControls">
        <button onClick={() => changeMonth(-1)}>⬅️ Prev Month</button>
        <span>{monthLabel}</span>
        <button onClick={() => changeMonth(1)}>➡️ Next Month</button>
      </div>

      {/* 📋 Habit Table */}
      <HabitTable
        habits={habits}
        checked={checked}
        currentWeek={currentWeek}
        toggleCheckbox={toggleCheckbox}
      />

      {/* 💾 Save Button */}
      <button onClick={saveDataToFirebase}>💾 Save Progress</button>

      {/* ⏮️⏭️ Week Controls */}
      <WeekControls
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
      />

      {/* 📈 Weekly Progress */}
      <WeeklyProgress checked={checked} currentWeek={currentWeek} />
      <MonthlySummary habits={habits} checked={checked} />

    </div>
  );
};

export default HabitTracker;
