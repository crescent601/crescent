// Access the global variables defined in dashboard.html
const chartData = window.globalChartData;
const labels = chartData.labels;
const totals = chartData.totals;

const territoryData = window.globalTerritoryData;
const territoryLabels = territoryData.labels;
const territoryValues = territoryData.values;

// --- First Chart: Monthly Totals ---
// Get the context of the canvas element for the first chart
const finalCtx = document.getElementById('finalChart').getContext('2d');
// Create a new Chart.js instance for monthly totals
new Chart(finalCtx, {
    type: 'bar', // Bar chart type
    data: {
        labels: labels, // Labels for the x-axis (e.g., month names)
        datasets: [{
            label: 'Monthly Total', // Label for the dataset
            data: totals, // Data points for the y-axis (monthly sums)
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color with transparency
            borderColor: 'rgba(54, 162, 235, 1)', // Solid blue border
            borderWidth: 1 // Border width
        }]
    },
    options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: true, // Maintain aspect ratio
        scales: {
            y: {
                beginAtZero: true, // Start y-axis at zero
                title: {
                    display: true,
                    text: 'Amount (₹)' // Y-axis label
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month' // X-axis label
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top', // Position legend at the top
            },
            title: {
                display: true,
                text: 'Monthly Expense Summary' // Chart title
            }
        }
    }
});

// --- Second Chart: Tour Plans per Territory ---
// Get the context of the canvas element for the second chart
const territoryCtx = document.getElementById('territoryChart').getContext('2d');
// Create a new Chart.js instance for tour plans per territory
new Chart(territoryCtx, {
    type: 'bar', // Bar chart type
    data: {
        labels: territoryLabels, // Labels for the x-axis (territory names)
        datasets: [{
            label: 'Number of Tour Plans', // Label for the dataset
            data: territoryValues, // Data points for the y-axis (counts)
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red color with transparency
            borderColor: 'rgba(255, 99, 132, 1)', // Solid red border
            borderWidth: 1 // Border width
        }]
    },
    options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: true, // Maintain aspect ratio
        scales: {
            y: {
                beginAtZero: true, // Start y-axis at zero
                title: {
                    display: true,
                    text: 'Count' // Y-axis label
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Territory' // X-axis label
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top', // Position legend at the top
            },
            title: {
                display: true,
                text: 'Tour Plans per Territory' // Chart title
            }
        }
    }
});
