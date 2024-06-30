// Function to show dashboard content
function showDashboard() {
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('complaints').style.display = 'none';
    document.getElementById('reports').style.display = 'none';
    document.getElementById('pending-complaints').style.display = 'none';
    document.getElementById('resolved-complaints').style.display = 'none';
    showRecentComplaints(); // Update recent complaints when switching to Dashboard
}

// Function to show complaints section
function showComplaint() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('complaints').style.display = 'block';
    document.getElementById('reports').style.display = 'none';
    document.getElementById('pending-complaints').style.display = 'none';
    document.getElementById('resolved-complaints').style.display = 'none';
    updateComplaintCounts();
}

// Function to show reports section
function showReport() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('complaints').style.display = 'none';
    document.getElementById('reports').style.display = 'block';
    document.getElementById('pending-complaints').style.display = 'none';
    document.getElementById('resolved-complaints').style.display = 'none';
    
    showDepartmentStatistics(); // Add this line
}

// Function to update complaint counts
function updateComplaintCounts() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const resolvedCount = complaints.filter(complaint => complaint.resolved).length;
    const pendingCount = complaints.filter(complaint => !complaint.resolved).length;

    document.getElementById('resolved-count').textContent = `RESOLVED (${resolvedCount})`;
    document.getElementById('pending-count').textContent = `PENDING (${pendingCount})`;
    document.getElementById('total-count').textContent = `TOTAL COMPLAINTS`;
}

// Function to show recent complaints in the dashboard
function showRecentComplaints() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    // Filter only pending complaints (not resolved)
    const pendingComplaints = complaints.filter(complaint => !complaint.resolved);

    // Sort pending complaints by date to get the most recent ones first
    pendingComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear previous content
    const recentComplaintsList = document.getElementById('recent-complaints-list');
    recentComplaintsList.innerHTML = '';

    // Display up to 5 most recent pending complaints (you can adjust this limit)
    const maxRecentComplaints = 5;
    for (let i = 0; i < Math.min(maxRecentComplaints, pendingComplaints.length); i++) {
        const complaint = pendingComplaints[i];

        // Create list item for complaint
        const listItem = document.createElement('div');
        listItem.classList.add('complaint-item');

        // Display name of complainant as clickable
        const nameLink = document.createElement('a');
        nameLink.textContent = `${complaint.name}`;
        nameLink.href = '#';
        nameLink.style.textDecoration = 'none'; // Remove underline
        nameLink.addEventListener('click', (event) => {
            event.preventDefault();
            showComplaintDetails(complaint);
        });
        listItem.appendChild(nameLink);

        // Display elapsed time since the complaint date
        const elapsedTimeLabel = document.createElement('p');
        elapsedTimeLabel.textContent = ` ${calculateElapsedTime(complaint.date)} `;
        listItem.appendChild(elapsedTimeLabel);

        
        // Display status of the complaint
        const statusLabel = document.createElement('p');
        statusLabel.textContent = `  Pending`;
        statusLabel.style.fontWeight = 'bold'; // Adjust styling for clarity
        listItem.appendChild(statusLabel);

        // Append the complaint item to the recent complaints list container
        recentComplaintsList.appendChild(listItem);
    }
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

// Function to show pending complaints
function showPendingComplaints() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('complaints').style.display = 'none';
    document.getElementById('reports').style.display = 'none';
    document.getElementById('pending-complaints').style.display = 'block';
    document.getElementById('resolved-complaints').style.display = 'none';

    document.getElementById('pending-list').innerHTML = '';

    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    let pendingIndex = 1;

    complaints.forEach((complaint, index) => {
        if (!complaint.resolved) {
            const listItem = document.createElement('div');
            listItem.classList.add('complaint-item');

            const nameLink = document.createElement('a');
            nameLink.textContent = `${pendingIndex}. ${complaint.name}`;
            nameLink.href = '#';
            nameLink.style.textDecoration = 'none';
            nameLink.addEventListener('click', (event) => {
                event.preventDefault();
                showComplaintDetails(complaint);
            });
            listItem.appendChild(nameLink);

            
            
            // Display elapsed time since the complaint date
            const elapsedTimeLabel = document.createElement('p');
            elapsedTimeLabel.textContent = ` ${calculateElapsedTime(complaint.date)} `;
            listItem.appendChild(elapsedTimeLabel);

            const resolveButton = document.createElement('button');
            resolveButton.textContent = 'Resolve';
            resolveButton.classList.add('inline-button');
            resolveButton.addEventListener('click', () => {
                resolveComplaint(index);
            });
            listItem.appendChild(resolveButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('inline-button', 'delete');
            deleteButton.addEventListener('click', () => {
                deleteComplaint(index, false);
            });
            listItem.appendChild(deleteButton);

            const replyButton = document.createElement('button');
            replyButton.textContent = 'Reply';
            replyButton.classList.add('inline-button', 'reply');
            replyButton.style.backgroundColor ='blue'
            replyButton.addEventListener('click', () => {
                window.location.href = `mailto:${complaint.email}?subject=Reply to your complaint&body=Dear ${complaint.name},\n\nRegarding your complaint: ${complaint.complaint}\n\nBest regards,\nAdmin`;
            });
            listItem.appendChild(replyButton);

            document.getElementById('pending-list').appendChild(listItem);

            pendingIndex++;
        }
    });
}

// Function to show resolved complaints
function showResolvedComplaints() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('complaints').style.display = 'none';
    document.getElementById('reports').style.display = 'none';
    document.getElementById('pending-complaints').style.display = 'none';
    document.getElementById('resolved-complaints').style.display = 'block';

    document.getElementById('resolved-list').innerHTML = '';

    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    let resolvedIndex = 1;

    complaints.forEach((complaint, index) => {
        if (complaint.resolved) {
            const listItem = document.createElement('div');
            listItem.classList.add('complaint-item');

            const nameLink = document.createElement('a');
            nameLink.textContent = `${resolvedIndex}. ${complaint.name}`;
            nameLink.href = '#';
            nameLink.style.textDecoration = 'none';
            nameLink.addEventListener('click', (event) => {
                event.preventDefault();
                showComplaintDetails(complaint);
            });
            listItem.appendChild(nameLink);

            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('inline-button', 'delete');
            deleteButton.addEventListener('click', () => {
                deleteComplaint(index, true);
            });
            listItem.appendChild(deleteButton);

            document.getElementById('resolved-list').appendChild(listItem);

            resolvedIndex++;
        }
    });
}

// Function to show all complaints
function showAllComplaints() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const totalComplaints = complaints.length;

    alert(`The Total Complaints is : ${totalComplaints}`);
}

// Function to show complaint details
function showComplaintDetails(complaint) {
    const detailsMessage = `Complaint Details:\n
        Student Number: ${complaint.studentNumber}\n
        Email: ${complaint.email}\n
        Department: ${complaint.department}\n
        Message: ${complaint.complaint}`;
    
    alert(detailsMessage);
}

// Function to resolve a pending complaint
function resolveComplaint(index) {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    complaints[index].resolved = true;
    localStorage.setItem('complaints', JSON.stringify(complaints));

    showResolvedComplaints();
    showPendingComplaints();
    updateComplaintCounts();
}

// Function to delete a complaint
function deleteComplaint(index, isResolved) {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    complaints.splice(index, 1);
    localStorage.setItem('complaints', JSON.stringify(complaints));

    if (isResolved) {
        showResolvedComplaints();
    } else {
        showPendingComplaints();
    }

    updateComplaintCounts();
}

// Function to calculate and display department statistics
function showDepartmentStatistics() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];

    const departmentCounts = {
        Academic: 0,
        Registrar: 0,
        Teacher: 0,
        Other: 0
    };

    complaints.forEach(complaint => {
        if (departmentCounts.hasOwnProperty(complaint.department)) {
            departmentCounts[complaint.department]++;
        } else {
            departmentCounts.Other++;
        }
    });

    const totalComplaints = complaints.length;
    const statisticsList = document.getElementById('department-statistics-list');
    statisticsList.innerHTML = '';

    for (const [department, count] of Object.entries(departmentCounts)) {
        const percentage = totalComplaints > 0 ? ((count / totalComplaints) * 100).toFixed(0) : 0;

        const listItem = document.createElement('div');
        listItem.classList.add('department-statistics-item');

        const departmentText = document.createElement('span');
        departmentText.textContent = `${department}: `;
        listItem.appendChild(departmentText);

        const countText = document.createElement('span');
        countText.textContent = `${count} (${percentage}%)`;
        listItem.appendChild(countText);

        statisticsList.appendChild(listItem);
    }

    // Concluding statement based on statistics
    const highestPercentageDepartment = getDepartmentWithHighestPercentage(departmentCounts, totalComplaints);
    const conclusionText = document.createElement('p');
    conclusionText.textContent = `According to the department statistics, ${highestPercentageDepartment} has the highest percentage of complaints.`;
    
    statisticsList.appendChild(conclusionText);
}

// Function to determine department with the highest percentage of complaints
function getDepartmentWithHighestPercentage(departmentCounts, totalComplaints) {
    let maxPercentage = -1;
    let departmentWithMaxPercentage = '';

    for (const [department, count] of Object.entries(departmentCounts)) {
        const percentage = totalComplaints > 0 ? (count / totalComplaints) * 100 : 0;
        if (percentage > maxPercentage) {
            maxPercentage = percentage;
            departmentWithMaxPercentage = department;
        }
    }

    return departmentWithMaxPercentage;
}


// Initialize dashboard display on page load
showDashboard();