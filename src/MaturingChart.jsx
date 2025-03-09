   // src/MaturingChart.jsx
   import React from 'react';
   import { Bar } from 'react-chartjs-2';
   import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

   ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

   const MaturingChart = ({ data }) => {
       const chartData = {
           labels: data.labels, // Array of month-year labels
           datasets: data.datasets.map((accountData) => ({
               label: accountData.accountName,
               data: accountData.amounts, // Array of amounts for each month
               backgroundColor: accountData.color, // Color for each account
           })),
       };

       const options = {
           responsive: true,
           plugins: {
               legend: {
                   position: 'top',
                   labels: {
                       generateLabels: (chart) => {
                           // Generate distinct labels for the legend
                           const uniqueLabels = new Set(chart.data.datasets.map(ds => ds.label));
                           return Array.from(uniqueLabels).map(label => ({
                               text: label,
                               fillStyle: chart.data.datasets.find(ds => ds.label === label).backgroundColor,
                               hidden: false,
                           }));
                       },
                   },
               },
               title: {
                   display: true,
                   text: 'Amounts Maturing by Month',
               },
           },
       };

       return <Bar data={chartData} options={options} />;
   };

   export default MaturingChart;