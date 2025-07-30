import React from 'react';

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// No longer importing ChartDataLabels, so remove it from the register call
ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlySummary = ({ habits, checked, days, numberOfWeeks }) => {
  if (!habits.length || !checked.length) {
    return null;
  }

  const habitDataForChart = [];
  const backgroundColors = [];
  const borderColors = [];

  const colorPalette = [
    '#4CAF50', // Green
    '#FFC107', // Amber
    '#2196F3', // Blue
    '#E91E63', // Pink
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#8BC34A', // Light Green
    '#FFEB3B', // Yellow
    '#607D8B', // Blue Grey
    '#795548', // Brown
    '#F44336', // Red
  ];

  let colorIndex = 0;
  let totalCompletedAcrossAllHabits = 0;

  habits.forEach((habitName, i) => {
    const habitCheckedRow = checked[i];
    if (habitCheckedRow) {
      const completedCount = habitCheckedRow.filter(Boolean).length;
      if (completedCount > 0) { // Only add slices for habits that have at least 1 completion
        habitDataForChart.push({
          label: habitName,
          value: completedCount, // The value for the slice is the count of completions
        });
        backgroundColors.push(colorPalette[colorIndex % colorPalette.length]);
        borderColors.push(colorPalette[colorIndex % colorPalette.length]);
        colorIndex++;
      }
      totalCompletedAcrossAllHabits += completedCount;
    }
  });

  if (totalCompletedAcrossAllHabits === 0) {
      habitDataForChart.push({
          label: 'No Habits Completed Yet',
          value: 1, // A single slice representing 100% of 'nothing'
      });
      backgroundColors.push('#D3D3D3'); // Grey color
      borderColors.push('#D3D3D3');
  }

  const chartData = {
    labels: habitDataForChart.map(data => data.label),
    datasets: [
      {
        data: habitDataForChart.map(data => data.value), // Values are completion counts
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#333',
          font: {
            size: 14
          },
          // Custom label generation to include percentage beside the text
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0); // Sum of all completed counts
              return data.labels.map(function(label, i) {
                const value = data.datasets[0].data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                return {
                  text: `${label} ${percentage}%`, // Combine label with percentage
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 1,
                  hidden: !chart.isDatasetVisible(0) || chart.getDatasetMeta(0).data[i].hidden,
                  // Extra data for custom events
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        enabled: true, // Keep tooltips for detailed info on hover
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed; // This is the 'completedCount' for the slice
            let percentageOfPie = 0;
            if (totalCompletedAcrossAllHabits > 0) {
              percentageOfPie = ((value / totalCompletedAcrossAllHabits) * 100).toFixed(1);
            }
            return `${label}: ${value} completions (${percentageOfPie}%)`;
          }
        }
      },
      // Remove datalabels plugin configuration from here
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="monthly-summary-section">
      <h2 className="section-title">Monthly Habit Summary</h2>
      <div className="overall-monthly-chart-container">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MonthlySummary;