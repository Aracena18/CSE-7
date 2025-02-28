document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const modal = document.getElementById('attendanceModal');
    const recordBtn = document.getElementById('recordAttendanceBtn');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const attendanceForm = document.getElementById('attendanceForm');
    const dateInput = document.getElementById('attendanceDate');
    
    // Set today's date as default
    dateInput.valueAsDate = new Date();

    // Event Listeners
    recordBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    dateInput.addEventListener('change', loadAttendanceData);
    attendanceForm.addEventListener('submit', handleAttendanceSubmit);

    // Initialize employee search
    initializeEmployeeSearch();
    
    // Load initial data
    loadAttendanceData();
    updateStats();

    // Modal Functions
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        attendanceForm.reset();
    }

    // Handle form submission
    async function handleAttendanceSubmit(e) {
        e.preventDefault();
        
        const formData = {
            employeeId: document.getElementById('employeeName').dataset.employeeId,
            timeIn: document.getElementById('timeIn').value,
            timeOut: document.getElementById('timeOut').value,
            status: document.getElementById('attendanceStatus').value,
            notes: document.getElementById('notes').value,
            date: dateInput.value
        };

        try {
            const response = await fetch('/CSE-7/api/attendance/record.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to record attendance');

            const result = await response.json();
            if (result.success) {
                showNotification('Attendance recorded successfully', 'success');
                closeModal();
                loadAttendanceData();
                updateStats();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    // Load attendance data
    async function loadAttendanceData() {
        const date = dateInput.value;
        const tableBody = document.getElementById('attendanceTableBody');
        
        try {
            const response = await fetch(`/CSE-7/api/attendance/get.php?date=${date}`);
            if (!response.ok) throw new Error('Failed to fetch attendance data');

            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            // Clear existing rows
            tableBody.innerHTML = '';

            // Populate table
            data.records.forEach(record => {
                const row = createAttendanceRow(record);
                tableBody.appendChild(row);
            });
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    // Create table row
    function createAttendanceRow(record) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="employee-info">
                    <div class="employee-name">${record.employeeName}</div>
                    <div class="employee-position">${record.position}</div>
                </div>
            </td>
            <td>${formatTime(record.timeIn)}</td>
            <td>${formatTime(record.timeOut)}</td>
            <td>
                <span class="status-badge status-${record.status.toLowerCase()}">
                    <i class="fas fa-circle"></i>
                    ${capitalizeFirst(record.status)}
                </span>
            </td>
            <td>${calculateWorkingHours(record.timeIn, record.timeOut)}</td>
            <td>
                <button class="edit-btn" onclick="editAttendance('${record.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteAttendance('${record.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }

    // Initialize employee search
    function initializeEmployeeSearch() {
        const searchInput = document.getElementById('employeeName');
        const resultsContainer = document.getElementById('employeeSearchResults');
        let debounceTimer;

        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                if (this.value.length < 2) {
                    resultsContainer.style.display = 'none';
                    return;
                }

                try {
                    const response = await fetch(`/CSE-7/api/employees/search.php?q=${this.value}`);
                    if (!response.ok) throw new Error('Search failed');

                    const data = await response.json();
                    displaySearchResults(data.employees);
                } catch (error) {
                    showNotification(error.message, 'error');
                }
            }, 300);
        });
    }

    // Display search results
    function displaySearchResults(employees) {
        const resultsContainer = document.getElementById('employeeSearchResults');
        resultsContainer.innerHTML = '';

        if (employees.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">No employees found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        employees.forEach(employee => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <div class="employee-name">${employee.name}</div>
                <div class="employee-position">${employee.position}</div>
            `;
            div.addEventListener('click', () => selectEmployee(employee));
            resultsContainer.appendChild(div);
        });

        resultsContainer.style.display = 'block';
    }

    // Select employee from search results
    function selectEmployee(employee) {
        const searchInput = document.getElementById('employeeName');
        const resultsContainer = document.getElementById('employeeSearchResults');
        
        searchInput.value = employee.name;
        searchInput.dataset.employeeId = employee.id;
        resultsContainer.style.display = 'none';
    }

    // Update statistics
    async function updateStats() {
        try {
            const response = await fetch(`/CSE-7/api/attendance/stats.php?date=${dateInput.value}`);
            if (!response.ok) throw new Error('Failed to fetch statistics');

            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            document.getElementById('presentCount').textContent = data.stats.present;
            document.getElementById('absentCount').textContent = data.stats.absent;
            document.getElementById('lateCount').textContent = data.stats.late;
            document.getElementById('attendanceRate').textContent = `${data.stats.rate}%`;
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    // Utility functions
    function formatTime(time) {
        return time ? new Date('2000-01-01T' + time).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        }) : '-';
    }

    function calculateWorkingHours(timeIn, timeOut) {
        if (!timeIn || !timeOut) return '-';

        const start = new Date('2000-01-01T' + timeIn);
        const end = new Date('2000-01-01T' + timeOut);
        const diff = (end - start) / (1000 * 60 * 60);
        
        return diff.toFixed(2) + ' hrs';
    }

    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    function showNotification(message, type = 'info') {
        // Implement notification system here
        console.log(`${type}: ${message}`);
    }
});
