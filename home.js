// Function to display complaint form
function showComplainForm() {
    var form = document.getElementById('complain-form');
    form.style.display = 'block';
}

// Function to handle complaint submission
function submitComplaint() {
    const studentNumber = document.getElementById('studentNumber').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;
    const complaint = document.getElementById('complaint').value;
    const date = new Date().toISOString(); // Capture current date and time

    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    complaints.push({ studentNumber, name, email, department, complaint, date });
    localStorage.setItem('complaints', JSON.stringify(complaints));

    alert('Complaint submitted successfully!');
    document.getElementById('complainForm').reset();

    // Display elapsed time in console for demonstration
    const elapsedTime = calculateElapsedTime(date);
    console.log(`Elapsed time since submission: ${elapsedTime}`);
}

// Function to calculate elapsed time since complaint date
function calculateElapsedTime(complaintDate) {
    const now = new Date();
    const complaintDateTime = new Date(complaintDate);
    const elapsedMilliseconds = now - complaintDateTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedDays > 0) {
        return `${elapsedDays} days ago`;
    } else if (elapsedHours > 0) {
        return `${elapsedHours} hours ago`;
    } else if (elapsedMinutes > 0) {
        return `${elapsedMinutes} minutes ago`;
    } else {
        return `${elapsedSeconds} seconds ago`;
    }
}

// Event listener for complaint submission form
document.getElementById('complainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitComplaint();
});
