document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const attendanceList = document.getElementById('attendanceList');
    const tasksList = document.getElementById('tasksList');
    const employeeSearch = document.getElementById('employeeSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const taskReviewModal = new bootstrap.Modal(document.getElementById('taskReviewModal'));
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    // Set current date
    dateFilter.valueAsDate = new Date();

    // Load initial data
    loadAttendanceData();
    loadTasksData();

    // Event listeners
    employeeSearch.addEventListener('input', filterEmployees);
    statusFilter.addEventListener('change', filterTasks);
    dateFilter.addEventListener('change', loadAttendanceData);
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    document.getElementById('approveTask').addEventListener('click', () => handleTaskReview('approve'));
    document.getElementById('rejectTask').addEventListener('click', () => handleTaskReview('reject'));
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.querySelector('.main-content').classList.toggle('expanded');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Functions
    function loadAttendanceData() {
        // Simulated API call - Replace with actual API endpoint
        fetch(`/api/attendance?date=${dateFilter.value}`)
            .then(response => response.json())
            .then(data => {
                renderAttendanceList(data);
            })
            .catch(error => console.error('Error loading attendance:', error));
    }

    function loadTasksData() {
        // Simulated API call - Replace with actual API endpoint
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => {
                renderTasksList(data);
            })
            .catch(error => console.error('Error loading tasks:', error));
    }

    function renderAttendanceList(employees) {
        attendanceList.innerHTML = employees.map(emp => `
            <tr>
                <td>${emp.name}</td>
                <td>
                    <span class="status-indicator status-${emp.status.toLowerCase()}">
                        ${emp.status}
                    </span>
                </td>
                <td>
                    <div class="time-checkbox-group">
                        <label class="time-checkbox">
                            <input type="checkbox" 
                                   ${emp.timeIn ? 'checked' : ''} 
                                   onchange="handleTimeRecord('${emp.id}', 'timeIn', this.checked)">
                            Time In
                        </label>
                        <span class="time-value" id="timeIn-${emp.id}">${emp.timeIn || '-'}</span>
                    </div>
                </td>
                <td>
                    <div class="time-checkbox-group">
                        <label class="time-checkbox">
                            <input type="checkbox"
                                   ${emp.timeOut ? 'checked' : ''} 
                                   onchange="handleTimeRecord('${emp.id}', 'timeOut', this.checked)">
                            Time Out
                        </label>
                        <span class="time-value" id="timeOut-${emp.id}">${emp.timeOut || '-'}</span>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    const originalRenderTasksList = renderTasksList;
    function renderTasksList(tasks) {
        tasksList.innerHTML = tasks.map(task => `
            <div class="task-card ${task.status.toLowerCase()}">
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span><i class="fas fa-user"></i> ${task.assignedTo}</span>
                    <span><i class="fas fa-clock"></i> ${task.status}</span>
                </div>
                ${task.status === 'Completed' ? `
                    <button class="btn btn-primary" onclick="reviewTask('${task.id}')">
                        <i class="fas fa-check-circle"></i>
                        Review Task
                    </button>
                ` : ''}
            </div>
        `).join('');
        animateTaskCards();
    }

    function filterEmployees() {
        const searchTerm = employeeSearch.value.toLowerCase();
        const rows = attendanceList.getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            row.style.display = name.includes(searchTerm) ? '' : 'none';
        });
    }

    function filterTasks() {
        const status = statusFilter.value;
        const cards = document.getElementsByClassName('task-card');
        
        Array.from(cards).forEach(card => {
            if (status === 'all' || card.classList.contains(status)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function refreshData() {
        loadAttendanceData();
        loadTasksData();
    }

    // Exposed global functions
    window.updateAttendance = function(employeeId, field, value) {
        // Implement API call to update attendance
        console.log(`Updating ${field} for employee ${employeeId} to ${value}`);
    };

    window.handleTimeRecord = function(employeeId, timeType, isChecked) {
        const currentTime = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });

        const timeElement = document.getElementById(`${timeType}-${employeeId}`);
        
        if (isChecked) {
            timeElement.textContent = currentTime;
            updateAttendance(employeeId, timeType, currentTime);
        } else {
            timeElement.textContent = '-';
            updateAttendance(employeeId, timeType, null);
        }

        // Update status based on time in/out state
        const timeInElement = document.getElementById(`timeIn-${employeeId}`);
        const hasTimeIn = timeInElement.textContent !== '-';
        updateAttendance(employeeId, 'status', hasTimeIn ? 'Present' : 'Absent');
    };

    window.reviewTask = function(taskId) {
        // Implement API call to get task details
        fetch(`/api/tasks/${taskId}`)
            .then(response => response.json())
            .then(task => {
                document.getElementById('taskDetails').innerHTML = `
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                    <p>Completed by: ${task.assignedTo}</p>
                `;
                document.getElementById('taskImage').src = task.proofImage;
                taskReviewModal.show();
            });
    };

    function handleTaskReview(action) {
        // Implement API call to handle task approval/rejection
        console.log(`Task ${action}ed`);
        taskReviewModal.hide();
        refreshData();
    }

    // Add smooth animations to task cards
    function animateTaskCards() {
        const cards = document.querySelectorAll('.task-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Update active state in sidebar
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    }
});
