import './habitTracker.css'; // Assuming this will contain your new CSS

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { useAuth } from '../context/AuthContext';
import {
  days,
  numberOfWeeks,
} from '../data/Habits';
import { db } from '../firebase';
// Import your existing or new sub-components
import HabitTable from './HabitTable';
import MonthlySummary from './MonthlySummary';
import WeekControls from './WeekControls';
import WeeklyProgress from './WeeklyProgress';

const HabitTracker = () => {
  const today = new Date();

  // State Variables
  const [habits, setHabits] = useState([]);
  const [checked, setChecked] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [newHabitName, setNewHabitName] = useState('');
  const [currentMonthYear, setCurrentMonthYear] = useState(() => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}_${month}`;
  });

  // Get user from AuthContext
  const { user, logout } = useAuth();

  // Derived state for display
  const monthLabel = new Date(
    parseInt(currentMonthYear.split('_')[0]),
    parseInt(currentMonthYear.split('_')[1]) - 1
  ).toLocaleString('default', { month: 'long', year: 'numeric' });

  // 🔁 Effect to load habits and checked state for the selected month/year
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.warn("No user logged in. Cannot fetch data. Clearing local state.");
        setHabits([]); // Clear habits if no user
        setChecked([]); // Clear checked data if no user
        return;
      }

      try {
        // Fetch user-specific habit list
        const habitsDocRef = doc(db, 'users', user.uid, 'habit-data', 'habitList');
        const habitsDocSnap = await getDoc(habitsDocRef);
        const fetchedHabits = habitsDocSnap.exists()
          ? habitsDocSnap.data().habits || []
          : [];
        setHabits(fetchedHabits);

        // Fetch user-specific monthly progress data
        const progressDocRef = doc(
          db,
          'users',
          user.uid,
          'monthly-progress',
          currentMonthYear
        );
        const progressDocSnap = await getDoc(progressDocRef);
        const progressData = progressDocSnap.exists()
          ? progressDocSnap.data()
          : {};

        // Map fetched habits to their checked states, initializing if missing
        const loadedCheckedState = fetchedHabits.map((_, habitIndex) =>
          progressData.checked?.[`habit_${habitIndex}`] ||
          Array(numberOfWeeks * days.length).fill(false)
        );
        setChecked(loadedCheckedState);
        console.log("Data fetched successfully for user:", user.uid, "month:", currentMonthYear);
      } catch (err) {
        console.error('Error loading data for user:', user?.uid, 'month:', currentMonthYear, 'Error:', err);
      }
    };

    fetchData();
  }, [currentMonthYear, user, numberOfWeeks, days.length]); // Added numberOfWeeks and days.length as dependencies for full clarity

  // ➕ Add new habit to Firebase and local state
  const addHabit = useCallback(async () => {
    console.log("Attempting to add habit. newHabitName:", newHabitName, "user:", user);
    if (!newHabitName.trim()) {
      alert('Please enter a habit name.');
      return;
    }
    if (!user) {
      alert('Please log in to add habits.');
      console.warn("addHabit: user is null, preventing habit addition.");
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'habit-data', 'habitList');

    try {
      await setDoc(
        docRef,
        {
          habits: arrayUnion(newHabitName.trim()),
        },
        { merge: true }
      );

      // Update local state after successful Firebase write
      setHabits((prevHabits) => [...prevHabits, newHabitName.trim()]);
      setChecked((prevChecked) => [
        ...prevChecked,
        Array(numberOfWeeks * days.length).fill(false),
      ]);

      setNewHabitName('');
      alert(`Habit "${newHabitName.trim()}" added successfully!`);
      console.log(`Habit "${newHabitName.trim()}" added to Firebase for user ${user.uid}`);
    } catch (err) {
      console.error('Error adding habit to Firebase:', err);
      alert('Failed to add habit. Please try again.');
    }
  }, [newHabitName, user, numberOfWeeks, days.length]);

  // ✅ Toggle checkbox for a specific habit and day
  const toggleCheckbox = useCallback((habitIndex, dayIndex) => {
    setChecked((prevChecked) =>
      prevChecked.map((row, i) =>
        i === habitIndex
          ? row.map((val, j) => (j === dayIndex ? !val : val))
          : row
      )
    );
  }, []);

  // 💾 Save current monthly progress to Firebase
  const saveDataToFirebase = useCallback(async () => {
    console.log("Attempting to save data. user:", user);
    if (!user) {
      alert('Please log in to save data.');
      console.warn("saveDataToFirebase: user is null, preventing data save.");
      return;
    }

    try {
      const checkedDataForFirebase = {};
      checked.forEach((row, i) => {
        checkedDataForFirebase[`habit_${i}`] = row;
      });

      const docRef = doc(db, 'users', user.uid, 'monthly-progress', currentMonthYear);
      await setDoc(
        docRef,
        {
          checked: checkedDataForFirebase,
          lastUpdated: new Date(),
        },
        { merge: true }
      );
      alert('Progress saved successfully to Firebase!');
      console.log(`Progress saved for user ${user.uid}, month ${currentMonthYear}`);
    } catch (e) {
      console.error('Error saving document to Firebase: ', e);
      alert('Failed to save data. Please try again.');
    }
  }, [checked, currentMonthYear, user]);

  // 📅 Change selected month (moves to previous/next month)
  const changeMonth = useCallback(
    (offset) => {
      const [year, month] = currentMonthYear.split('_').map(Number);
      const newDate = new Date(year, month - 1 + offset);
      const newMonthYear = `${newDate.getFullYear()}_${String(
        newDate.getMonth() + 1
      ).padStart(2, '0')}`;
      setCurrentMonthYear(newMonthYear);
      setCurrentWeek(0); // Reset to Week 1 (index 0) when changing months
      console.log("Month changed to:", newMonthYear);
    },
    [currentMonthYear]
  );

  return (
    <div className="habit-tracker-container">
      {/* Header Section */}
      <header className="app-header">
        <span className="user-info">Hi, {user ? user.email : 'Guest'}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      {/* Main Content Area */}
      <div className="main-content">
        <h1 className="section-title">
          Daily Habits - {monthLabel}, Week {currentWeek + 1}
        </h1>

        {/* Month Navigation Controls */}
        <div className="month-navigation">
          <button
            className="nav-button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous Month"
          >
            &lt; Prev Month
          </button>
          <span className="current-month-label">{monthLabel}</span>
          <button
            className="nav-button"
            onClick={() => changeMonth(1)}
            aria-label="Next Month"
          >
            Next Month &gt;
          </button>
        </div>

        {/* Add New Habit Form */}
        <form
          className="add-habit-form"
          onSubmit={(e) => {
            e.preventDefault();
            addHabit();
          }}
        >
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Add new habit"
            className="add-habit-input"
            aria-label="New habit name"
          />
          <button type="submit" className="add-habit-btn">
            + Add new habit
          </button>
        </form>

        {/* Habit Table Component */}
       <HabitTable
          habits={habits}
          checked={checked}
          currentWeek={currentWeek}
          toggleCheckbox={toggleCheckbox}
          setHabits={setHabits}
          setChecked={setChecked}
          days={days}
          numberOfWeeks={numberOfWeeks}
          user={user} // Passed user to HabitTable
        />

        {/* Save Progress Button */}
        <button className="save-progress-btn" onClick={saveDataToFirebase}>
          Save Progress
        </button>

        {/* Week Controls Component */}
        <WeekControls
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          numberOfWeeks={numberOfWeeks}
        />

        {/* Weekly Progress Component */}
        <WeeklyProgress
          checked={checked}
          currentWeek={currentWeek}
          days={days}
        />

        {/* Monthly Summary Component */}
        <MonthlySummary
          habits={habits}
          checked={checked}
          days={days}
          numberOfWeeks={numberOfWeeks}
        />
        </div>
    </div>
  );
};

export default HabitTracker;