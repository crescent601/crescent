document.addEventListener("DOMContentLoaded", function() {
    console.log("Tour Plan page loaded and JS is working!");
    // Example: Highlight today's row (if you want)
    const today = new Date().toISOString().split('T')[0];
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach(row => {
        if (row.innerText.includes(today)) {
            row.style.backgroundColor = "#d1e7dd"; // light green
        }
    });
});
