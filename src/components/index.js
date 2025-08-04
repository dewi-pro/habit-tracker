import './habitTracker.css';

import React, {
  useCallback,
  useEffect,
  useRef,
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
  const [calculatedNumberOfWeeks, setCalculatedNumberOfWeeks] = useState(0); // NEW STATE
  const { user, logout } = useAuth();

  // Refs for scroll synchronization
  const progressGridRef = useRef(null);
  const habitTableContainerRef = useRef(null);

  const monthLabel = new Date(
    parseInt(currentMonthYear.split('_')[0]),
    parseInt(currentMonthYear.split('_')[1]) - 1
  ).toLocaleString('default', { month: 'long', year: 'numeric' });

  // --- NEW: Calculate dates for the current week ---
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const [year, month] = currentMonthYear.split('_').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0); // Last day of the current month

    const dayOfWeekFirstDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday
    const offsetToMondayFirstWeek = (dayOfWeekFirstDay === 0) ? 6 : (dayOfWeekFirstDay - 1); // Days to rewind to get to the first Monday of the first displayed week

    const startDateOfFirstDisplayedWeek = new Date(firstDayOfMonth);
    startDateOfFirstDisplayedWeek.setDate(firstDayOfMonth.getDate() - offsetToMondayFirstWeek);

    // Calculate how many weeks are fully or partially displayed for this month
    let weeksCount = 0;
    let currentDateIterator = new Date(startDateOfFirstDisplayedWeek);

    // Loop until we pass the last day of the current month
    // We count a "week" if it contains at least one day of the current month
    // or is part of the sequence of weeks that covers the month.
    // The previous logic was based on a fixed number of weeks, now it's dynamic.
    while (currentDateIterator.getMonth() < month || (currentDateIterator.getMonth() === month - 1 && currentDateIterator.getDate() <= lastDayOfMonth.getDate()) || (currentDateIterator.getMonth() === month && currentDateIterator.getDate() <= lastDayOfMonth.getDate())) {
        weeksCount++;
        currentDateIterator.setDate(currentDateIterator.getDate() + days.length); // Move to the start of the next week
        if (weeksCount > 10) break; // Safety break to prevent infinite loops in edge cases
    }

    // A more robust way to calculate total weeks:
    // Determine the start of the last displayed week.
    // The last week is the one that contains the last day of the month.
    const lastDayOfMonthDayOfWeek = lastDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday
    const offsetFromLastDayToLastMonday = (lastDayOfMonthDayOfWeek === 0) ? 6 : (lastDayOfMonthDayOfWeek - 1);
    const startOfLastDisplayedWeek = new Date(lastDayOfMonth);
    startOfLastDisplayedWeek.setDate(lastDayOfMonth.getDate() - offsetFromLastDayToLastMonday);


    // Calculate total days from first displayed monday to last displayed monday
    const diffTime = Math.abs(startOfLastDisplayedWeek.getTime() - startDateOfFirstDisplayedWeek.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Number of weeks is (total days + 1 for the start day) / days per week
    let finalCalculatedWeeks = Math.ceil((diffDays + 1) / days.length);
    // If start and end are in the same week, diffDays + 1 might be < 7, so it's 1 week.
    if (finalCalculatedWeeks === 0 && (firstDayOfMonth.getMonth() === month -1 || lastDayOfMonth.getMonth() === month -1)) {
      finalCalculatedWeeks = 1; // At least one week if there's any part of the month
    }


    // Ensure it's at least 1 and doesn't exceed 6 or 7 weeks (common maximum for a month's calendar display)
    finalCalculatedWeeks = Math.max(1, finalCalculatedWeeks); // A month always has at least one week
    // Cap at a reasonable max to prevent UI issues if calculation is slightly off for very long spans
    finalCalculatedWeeks = Math.min(finalCalculatedWeeks, 6); // A calendar month usually spans max 6 weeks

    setCalculatedNumberOfWeeks(finalCalculatedWeeks);


    // Update weekDates for the currentWeek (same logic as before)
    const dates = [];
    const startOfWeek = new Date(startDateOfFirstDisplayedWeek);
    startOfWeek.setDate(startDateOfFirstDisplayedWeek.getDate() + (currentWeek * days.length));

    for (let i = 0; i < days.length; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    setWeekDates(dates);

    // Ensure currentWeek doesn't exceed the new calculated number of weeks
    if (currentWeek >= finalCalculatedWeeks) {
        setCurrentWeek(finalCalculatedWeeks > 0 ? finalCalculatedWeeks - 1 : 0);
    }

  }, [currentMonthYear, currentWeek]);


  // 🔁 Effect to load habits and checked state for the selected month/year
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.warn("No user logged in. Cannot fetch data. Clearing local state.");
        setHabits([]);
        setChecked([]);
        return;
      }

      try {
        const habitsDocRef = doc(db, 'users', user.uid, 'habit-data', 'habitList');
        const habitsDocSnap = await getDoc(habitsDocRef);
        const fetchedHabits = habitsDocSnap.exists()
          ? habitsDocSnap.data().habits || []
          : [];
        setHabits(fetchedHabits);

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
  }, [currentMonthYear, user]);

  // ➕ Add new habit to Firebase and local state
  const addHabit = useCallback(async () => {
    if (!newHabitName.trim()) {
      alert('Please enter a habit name.');
      return;
    }
    if (!user) {
      alert('Please log in to add habits.');
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

      setHabits((prevHabits) => [...prevHabits, newHabitName.trim()]);
      setChecked((prevChecked) => [
        ...prevChecked,
        Array(numberOfWeeks * days.length).fill(false),
      ]);

      setNewHabitName('');
    } catch (err) {
      console.error('Error adding habit to Firebase:', err);
      alert('Failed to add habit. Please try again.');
    }
  }, [newHabitName, user]);

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
      alert('Progress saved successfully!');
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
    },
    [currentMonthYear]
  );

  // --- NEW: Scroll Synchronization Logic ---
useEffect(() => {
    const progressGridElement = progressGridRef.current;
    const habitTableContainerElement = habitTableContainerRef.current;

    const syncScroll = (scrollingElement, targetElement) => {
        if (scrollingElement && targetElement) {
            targetElement.scrollLeft = scrollingElement.scrollLeft;
        }
    };

    let isScrollingProgrammatically = false;

    const handleProgressScroll = () => {
        if (!isScrollingProgrammatically) {
            isScrollingProgrammatically = true;
            requestAnimationFrame(() => {
                syncScroll(progressGridElement, habitTableContainerElement);
                isScrollingProgrammatically = false;
            });
        }
    };

    const handleTableScroll = () => {
        if (!isScrollingProgrammatically) {
            isScrollingProgrammatically = true;
            requestAnimationFrame(() => {
                syncScroll(habitTableContainerElement, progressGridElement);
                isScrollingProgrammatically = false;
            });
        }
    };

    if (progressGridElement && habitTableContainerElement) {
        progressGridElement.addEventListener('scroll', handleProgressScroll);
        habitTableContainerElement.addEventListener('scroll', handleTableScroll);

        return () => {
            progressGridElement.removeEventListener('scroll', handleProgressScroll);
            habitTableContainerElement.removeEventListener('scroll', handleTableScroll);
        };
    }
}, []);
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

        {/* Weekly Progress Component - Pass weekDates and ref */}
        <WeeklyProgress
          checked={checked}
          currentWeek={currentWeek}
          days={days}
          weekDates={weekDates}
          progressGridRef={progressGridRef}
        />

        {/* Habit Table Component - Pass weekDates and ref */}
       <HabitTable
          habits={habits}
          checked={checked}
          currentWeek={currentWeek}
          toggleCheckbox={toggleCheckbox}
          setHabits={setHabits}
          setChecked={setChecked}
          days={days}
          numberOfWeeks={numberOfWeeks}
          user={user}
          weekDates={weekDates}
          habitTableContainerRef={habitTableContainerRef}
        />

        {/* Save Progress Button */}
        <button className="save-progress-btn" onClick={saveDataToFirebase}>
          Save Progress
        </button>

        {/* Monthly Summary Component */}
        <MonthlySummary
          habits={habits}
          checked={checked}
          days={days}
          numberOfWeeks={numberOfWeeks}
        />

        {/* Week Controls Component - Pass calculatedNumberOfWeeks */}
        <WeekControls
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          calculatedNumberOfWeeks={calculatedNumberOfWeeks}
          monthLabel={monthLabel}
        />
        </div>
    </div>
  );
};

export default HabitTracker;