import './habitTracker.css'; // Assuming this will contain your new CSS

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react'; // Added useCallback for optimizations

import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'; // Grouped Firebase imports

import { useAuth } from '../context/AuthContext';
import {
  days,
  numberOfWeeks,
} from '../data/Habits'; // Correct path
import { db } from '../firebase'; // Correct path
// Import your existing or new sub-components
import HabitTable from './HabitTable';
import MonthlySummary from './MonthlySummary';
import WeekControls from './WeekControls';
import WeeklyProgress from './WeeklyProgress';

const HabitTracker = () => {
  const today = new Date(); // Gets the current date for initial state

  // State Variables
  const [habits, setHabits] = useState([]); // Array of habit names (e.g., ['Tahajud Witir', 'Istighosah'])
  const [checked, setChecked] = useState([]); // 2D array: checked[habitIndex][dayIndex] -> boolean
  const [currentWeek, setCurrentWeek] = useState(0); // 0-indexed week (0 = Week 1)
  const [newHabitName, setNewHabitName] = useState(''); // Input for new habit
  const [currentMonthYear, setCurrentMonthYear] = useState(() => {
    // Initialize with current month/year for data fetching
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}_${month}`;
  });
const {logout } = useAuth();
  // Derived state for display
  const monthLabel = new Date(
    parseInt(currentMonthYear.split('_')[0]), // Year
    parseInt(currentMonthYear.split('_')[1]) - 1 // Month (0-indexed)
  ).toLocaleString('default', { month: 'long', year: 'numeric' });

  // 🔁 Effect to load habits and checked state for the selected month/year
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get habit list (global for all users, or user-specific if `habitList` doc changes)
        // Assuming 'habitList' is a common document for all users or a default list
        const habitsDocRef = doc(db, 'habit-tracker', 'habitList');
        const habitsDocSnap = await getDoc(habitsDocRef);
        const fetchedHabits = habitsDocSnap.exists()
          ? habitsDocSnap.data().habits || [] // Ensure it's an array, default to empty
          : [];
        setHabits(fetchedHabits);

        // 2️⃣ Get monthly progress data for the specific user and month
        const progressDocRef = doc(
          db,
          'habit-tracker',
          `user1_${currentMonthYear}`
        ); // Using 'user1' as a placeholder user ID
        const progressDocSnap = await getDoc(progressDocRef);
        const progressData = progressDocSnap.exists()
          ? progressDocSnap.data()
          : {};

        // Map the fetched habits to their checked states.
        // If a habit has no existing checked data, initialize it with all false.
        const loadedCheckedState = fetchedHabits.map((_, habitIndex) =>
          progressData.checked?.[`habit_${habitIndex}`] ||
          Array(numberOfWeeks * days.length).fill(false)
        );
        setChecked(loadedCheckedState);
      } catch (err) {
        console.error('Error loading data:', err);
        // Optionally, add user feedback (e.g., toast message)
      }
    };

    fetchData();
  }, [currentMonthYear]); // Re-run when month/year changes

  // ➕ Add new habit to Firebase and local state
  const addHabit = useCallback(async () => {
    if (!newHabitName.trim()) {
      alert('Please enter a habit name.');
      return;
    }

    const docRef = doc(db, 'habit-tracker', 'habitList'); // Reference to the habit list document

    try {
      // Use setDoc with merge:true to create if not exists, or update if exists
      // This is safer than updateDoc for initial creation
      await setDoc(
        docRef,
        {
          habits: arrayUnion(newHabitName.trim()), // Add new habit name to the array
        },
        { merge: true } // Crucial: merges with existing document data, doesn't overwrite
      );

      // Update local state:
      // 1. Add the new habit name to the habits array
      setHabits((prevHabits) => [...prevHabits, newHabitName.trim()]);

      // 2. Add a new row of 'false' to the checked state for the new habit
      setChecked((prevChecked) => [
        ...prevChecked,
        Array(numberOfWeeks * days.length).fill(false),
      ]);

      setNewHabitName(''); // Clear the input field
      alert(`Habit "${newHabitName.trim()}" added successfully!`);
    } catch (err) {
      console.error('Error adding habit:', err);
      alert('Failed to add habit. Please try again.');
    }
  }, [newHabitName]); // Recreate if newHabitName changes

  // ✅ Toggle checkbox for a specific habit and day
  const toggleCheckbox = useCallback((habitIndex, dayIndex) => {
    setChecked((prevChecked) =>
      prevChecked.map((row, i) =>
        i === habitIndex
          ? row.map((val, j) => (j === dayIndex ? !val : val)) // Toggle the specific day's value
          : row
      )
    );
  }, []); // No dependencies, can be memoized once

  // 💾 Save current monthly progress to Firebase
  const saveDataToFirebase = useCallback(async () => {
    try {
      const checkedDataForFirebase = {};
      checked.forEach((row, i) => {
        checkedDataForFirebase[`habit_${i}`] = row; // Store each habit's checked state as `habit_0`, `habit_1`, etc.
      });

      const docRef = doc(db, 'habit-tracker', `user1_${currentMonthYear}`);
      await setDoc(
        docRef,
        {
          checked: checkedDataForFirebase,
          lastUpdated: new Date(), // Add a timestamp for tracking
        },
        { merge: true } // Use merge to avoid overwriting other potential fields
      );
      alert('Progress saved successfully to Firebase!');
    } catch (e) {
      console.error('Error saving document: ', e);
      alert('Failed to save data. Please try again.');
    }
  }, [checked, currentMonthYear]); // Recreate if checked or month/year changes

  // 📅 Change selected month (moves to previous/next month)
  const changeMonth = useCallback(
    (offset) => {
      const [year, month] = currentMonthYear.split('_').map(Number); // Parse current year and month
      const newDate = new Date(year, month - 1 + offset); // Create new date object
      const newMonthYear = `${newDate.getFullYear()}_${String(
        newDate.getMonth() + 1
      ).padStart(2, '0')}`; // Format to YYYY_MM
      setCurrentMonthYear(newMonthYear); // Update month/year state
      setCurrentWeek(0); // Always reset to Week 1 (index 0) when changing months
    },
    [currentMonthYear]
  ); // Recreate if currentMonthYear changes

  return (
    <div className="habit-tracker-container">
      {/* Header Section */}
      <header className="app-header">
        <span className="user-info">Hi, udaichi02@gmail.com</span>
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
            e.preventDefault(); // Prevent page reload
            addHabit(); // Call the memoized addHabit function
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
          setHabits={setHabits}         // <-- NEW
          setChecked={setChecked}       // <-- NEW
          days={days}
          numberOfWeeks={numberOfWeeks}
        />

        {/* Save Progress Button */}
        <button className="save-progress-btn" onClick={saveDataToFirebase}>
          Save Progress
        </button>

        {/* Week Controls Component */}
        <WeekControls
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          numberOfWeeks={numberOfWeeks} // Pass total weeks
        />

        {/* Weekly Progress Component */}
        <WeeklyProgress
          checked={checked}
          currentWeek={currentWeek}
          days={days} // Pass days for weekly progress visualization
        />

        {/* Monthly Summary Component */}
        <MonthlySummary
          habits={habits}
          checked={checked}
          days={days}           // <-- NEW
          numberOfWeeks={numberOfWeeks} // <-- NEW
        />      
        </div>
    </div>
  );
};

export default HabitTracker;