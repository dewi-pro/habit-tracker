// MonthlySummary.js (No change from the previous version for legend position logic)

import React, {
  useEffect,
  useState,
} from 'react';

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlySummary = ({ habits, checked, days, numberOfWeeks }) => {
  const [legendPosition, setLegendPosition] = useState('right');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setLegendPosition('bottom'); // Legend will be at the bottom on mobile
      } else {
        setLegendPosition('right');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      if (completedCount > 0) {
        habitDataForChart.push({
          label: habitName,
          value: completedCount,
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
          value: 1,
      });
      backgroundColors.push('#D3D3D3');
      borderColors.push('#D3D3D3');
  }

  const chartData = {
    labels: habitDataForChart.map(data => data.label),
    datasets: [
      {
        data: habitDataForChart.map(data => data.value),
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
        position: legendPosition, // Uses 'bottom' on mobile, 'right' on desktop
        labels: {
          color: '#333',
          font: {
            size: 14
          },
          // Use a function for 'align' to conditionally set it
          // This ensures the legend items themselves are aligned left
          align: (chart) => {
            return chart.options.plugins.legend.position === 'bottom' ? 'start' : 'center';
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
              return data.labels.map(function(label, i) {
                const value = data.datasets[0].data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                return {
                  text: `${label} ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 1,
                  hidden: !chart.isDatasetVisible(0) || chart.getDatasetMeta(0).data[i].hidden,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            let percentageOfPie = 0;
            if (totalCompletedAcrossAllHabits > 0) {
              percentageOfPie = ((value / totalCompletedAcrossAllHabits) * 100).toFixed(1);
            }
            return `${label}: ${value} completions (${percentageOfPie}%)`;
          }
        }
      },
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