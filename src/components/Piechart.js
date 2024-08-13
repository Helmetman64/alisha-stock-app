import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Piechart = ({ salesHistory }) => {
  const aggregateQtySoldByItem = () => {
    const itemTotals = salesHistory.reduce((acc, curr) => {
      if (acc[curr.itemName]) {
        acc[curr.itemName] += curr.qtySold;
      } else {
        acc[curr.itemName] = curr.qtySold;
      }
      return acc;
    }, {});

    // Prepare the data for react-chartjs-2 Pie Chart
    const labels = Object.keys(itemTotals); // Array of item names
    const data = Object.values(itemTotals); // Array of corresponding quantities

    return {
      labels, // Labels for the chart
      datasets: [
        {
          label: "Quantity Sold",
          data, // Data for the chart
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ], // Customize as needed
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ], // Customize as needed
        },
      ],
    };
  };

  const pieData = aggregateQtySoldByItem(salesHistory);

  return (
    <div className="chart-container">
      <Pie data={pieData} />
    </div>
  );
};

export default Piechart;
