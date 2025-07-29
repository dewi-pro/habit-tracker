import './App.css';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import pots from './components/pots';
import { db } from './firebase';

const habits = [
  "Tahajud Witir", "Istighosah", "Qobliyah Subuh", "Dzikir Qobliyah Subuh",
  "Shadaqah Subuh", "Hirzi Pagi", "Isro'", "Dhuha", "Dzikir Pagi",
  "Dzikir Sore", "Ngaji Sore", "Hirzi Petang", "Awwabin", "Rawatib 5", "Membaca Al Quran"
];
const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const numberOfWeeks = 4;

function App() {
  const [checked, setChecked] = useState(
    Array(habits.length).fill(null).map(() =>
      Array(numberOfWeeks * days.length).fill(false)
    )
  );
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = Week 1

  // Save: Convert 2D array into an object Firestore can store
  const saveDataToFirebase = async () => {
    try {
      const checkedObj = {};
      checked.forEach((row, habitIndex) => {
        checkedObj[`habit_${habitIndex}`] = row;
      });

      await setDoc(doc(db, "habit-tracker", "user1"), {
        checked: checkedObj,
      });
      alert("Data saved to Firebase!");
    } catch (e) {
      console.error("Error saving document: ", e);
    }
  };

  // Load: Convert saved object back into 2D array
  useEffect(() => {
    const loadData = async () => {
      const docRef = doc(db, "habit-tracker", "user1");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const loadedChecked = [];

        for (let i = 0; i < habits.length; i++) {
          loadedChecked.push(data.checked?.[`habit_${i}`] || Array(numberOfWeeks * days.length).fill(false));
        }
        setChecked(loadedChecked);
      } else {
        console.log("No data found.");
      }
    };

    loadData();
  }, []);

  const toggleCheckbox = (habitIndex, dayIndex) => {
    const updated = checked.map((row, i) =>
      i === habitIndex
        ? row.map((val, j) => (j === dayIndex ? !val : val))
        : row
    );
    setChecked(updated);
  };

  // Get progress % for a specific day (0 = Sunday)
  const getDayProgress = (dayIndex) => {
    const index = currentWeek * 7 + dayIndex;
    let completed = 0;

    checked.forEach((habitRow) => {
      if (habitRow[index]) completed++;
    });

    const total = habits.length; // 1 task per habit per day
    return Math.round((completed / total) * 100);
  };

  // Decide pot stage based on % progress
  const getStage = (percent) => {
    if (percent >= 75) return "bloom";
    if (percent >= 50) return "growing";
    if (percent >= 25) return "sprout";
    return "empty";
  };

  return (
    <div className="App">
      <h1>Daily Habits - Week {currentWeek + 1}</h1>
      <table>
        <thead>
          <tr>
            <th rowSpan="2">Daily Habits</th>
            <th rowSpan="2">Completed</th>
            {days.map((day, i) => (
              <th key={day + i}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, i) => (
            <tr key={i}>
              <td>{habit}</td>
              <td>{checked[i].slice(currentWeek * 7, currentWeek * 7 + 7).filter(Boolean).length}</td>
              {Array.from({ length: 7 }, (_, dIdx) => {
                const globalDayIndex = currentWeek * 7 + dIdx;
                return (
                  <td key={dIdx}>
                    <input
                      type="checkbox"
                      checked={checked[i][globalDayIndex]}
                      onChange={() => toggleCheckbox(i, globalDayIndex)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={saveDataToFirebase}>💾 Save Progress</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setCurrentWeek((w) => Math.max(w - 1, 0))} disabled={currentWeek === 0}>
          ◀️ Previous Week
        </button>
        <span style={{ margin: "0 10px" }}>Week {currentWeek + 1} of {numberOfWeeks}</span>
        <button onClick={() => setCurrentWeek((w) => Math.min(w + 1, numberOfWeeks - 1))} disabled={currentWeek === numberOfWeeks - 1}>
          Next Week ▶️
        </button>
      </div>

      {/* Progress pots per day (Min–Sab) */}
      <div style={{ marginTop: 40 }}>
        <h2>Week {currentWeek + 1} Progress</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {days.map((dayName, dayIdx) => {
            const percent = getDayProgress(dayIdx);
            const stage = getStage(percent);
            return (
              <div key={dayName} style={{ textAlign: 'center' }}>
                <strong>{dayName}</strong>
                <div style={{ marginTop: 10 }}>{pots[stage]}</div>
                <div>{percent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
