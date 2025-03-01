document.addEventListener('AttendanceLoaded', function() {
    console.log('🟢 AttendanceLoaded event fired');
    
    const recordBtn = document.getElementById('recordAttendanceBtn');
    const modal = document.getElementById('recordAttendanceModal'); // Changed to match the ID in homepage.php
    
    console.log('📝 Record button found:', !!recordBtn);
    console.log('🔲 Modal found:', !!modal);
    
    if (recordBtn && modal) {
        recordBtn.addEventListener('click', function() {
            console.log('👆 Record attendance button clicked');
            modal.style.display = 'block';
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';

            
            
            document.dispatchEvent(new CustomEvent('Attendancebuttonclicked'));
            
            // Center the modal content
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.margin = '0 auto'; // Center horizontally
                modalContent.style.position = 'relative';
                modalContent.style.transform = 'translateY(0)';
            }
            
            console.log('🔳 Modal display properties:', {
                display: modal.style.display,
                opacity: modal.style.opacity,
                visibility: modal.style.visibility
            });
        });
    } else {
        console.error('❌ Missing elements:', {
            recordBtn: !recordBtn ? 'Not found' : 'Found',
            modal: !modal ? 'Not found' : 'Found'
        });
    }

    // Initialize close buttons with updated close logic
    const closeBtn = modal?.querySelector('.close-btn');
    const cancelBtn = modal?.querySelector('.cancel-btn');
    
    const closeModal = () => {
        if (modal) {
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            
            // Reset form if it exists
            const form = document.getElementById('attendanceForm');
            if (form) form.reset();
            
            console.log('🔳 Modal hidden');
        }
    };
    
    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    initializeAttendanceModal();
    initializeEmployeeSearch();
});

function initializeAttendanceModal() {
    const modal = document.getElementById('recordAttendanceModal');
    const form = document.getElementById('recordAttendanceForm');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    // Time and date elements
    const timeInBtn = document.getElementById('timeInBtn');
    const timeOutBtn = document.getElementById('timeOutBtn');
    const timeInInput = document.getElementById('timeIn');
    const timeOutInput = document.getElementById('timeOut');
    const dateInput = document.getElementById('attendanceDate');

    // Set current date in format: Wednesday, February 28, 2024
    const today = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateInput.value = today.toLocaleDateString('en-US', dateOptions);

    // Time in button handler with improved formatting
    timeInBtn.addEventListener('click', function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
        timeInInput.value = timeString;
        this.disabled = true;
        this.classList.add('recorded');
        this.textContent = '✓ Time In Recorded';
        timeOutBtn.disabled = false;

        // Auto-detect if late (after 9:00 AM)
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const status = document.getElementById('status');
        if (hour > 9 || (hour === 9 && minutes > 0)) {
            status.value = 'late';
        } else {
            status.value = 'present';
        }
    });

    // Time out button handler with improved formatting
    timeOutBtn.addEventListener('click', function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
        timeOutInput.value = timeString;
        this.disabled = true;
        this.classList.add('recorded');
        this.textContent = '✓ Time Out Recorded';
    });

    // Reset form when opening modal
    function resetForm() {
        form.reset();
        timeInBtn.disabled = false;
        timeOutBtn.disabled = true;
        timeInBtn.textContent = 'Record Time In';
        timeOutBtn.textContent = 'Record Time Out';
        dateInput.value = new Date().toLocaleDateString('en-US', dateOptions);
        timeInInput.value = '';
        timeOutInput.value = '';
    }

    // Form submission handler with submission lock
    let isSubmitting = false; // Add submission lock flag

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prevent double submission
        if (isSubmitting) {
            console.log('Form is already being submitted');
            return;
        }
        
        console.log('Form submission started');
        isSubmitting = true;

        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalButtonText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        const formData = new FormData(form);

        try {
            const response = await fetch('/CSE-7/CSE7_Frontend/attendance_folder/record_attendance.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                alert('Attendance recorded successfully');
                modal.style.display = 'none';
                resetForm();
                if (typeof loadAttendanceData === 'function') {
                    await loadAttendanceData();
                }
                if (typeof updateAttendanceStats === 'function') {
                    await updateAttendanceStats();
                }
            } else {
                throw new Error(data.message || 'Failed to record attendance');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error recording attendance: ' + error.message);
        } finally {
            // Reset submission lock and button state
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = originalButtonText;
        }
    });

    // Clean up event listeners when modal is closed
    const cleanup = () => {
        isSubmitting = false;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    };

    // Add cleanup to modal close handlers
    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            modal.style.display = 'none';
            resetForm();
            cleanup();
        });
    });

    // Clean up when clicking outside modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetForm();
            cleanup();
        }
    });
}

function initializeEmployeeSearch() {
    const searchInput = document.getElementById('employeeName');
    const resultsDiv = document.getElementById('employeeSearchResults');
    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (this.value.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            try {
                const response = await fetch(`/CSE-7/CSE7_Frontend/employee_folder/search_employees.php?term=${encodeURIComponent(this.value)}`);
                const data = await response.json();
                
                resultsDiv.innerHTML = '';
                data.forEach(employee => {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.innerHTML = `
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-position">${employee.position}</div>
                    `;
                    div.addEventListener('click', () => {
                        searchInput.value = employee.name;
                        searchInput.dataset.employeeId = employee.id;
                        resultsDiv.innerHTML = '';
                    });
                    resultsDiv.appendChild(div);
                });
            } catch (error) {
                console.error('Error searching employees:', error);
            }
        }, 300);
    });

    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            resultsDiv.innerHTML = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize employee search
    const employeeNameInput = document.getElementById('employeeName');
    const searchResults = document.getElementById('employeeSearchResults');
    
    if (employeeNameInput && searchResults) {
        new EmployeeSearch('employeeName', 'employeeSearchResults');
    }

    // Set today's date
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Time button handlers
    const timeInBtn = document.getElementById('timeInBtn');
    const timeOutBtn = document.getElementById('timeOutBtn');
    const timeInInput = document.getElementById('timeIn');
    const timeOutInput = document.getElementById('timeOut');

    if (timeInBtn && timeOutBtn && timeInInput && timeOutInput) {
        timeInBtn.addEventListener('click', function() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeInInput.value = timeString;
            this.disabled = true;
            timeOutBtn.disabled = false;
        });

        timeOutBtn.addEventListener('click', function() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeOutInput.value = timeString;
            this.disabled = true;
        });
    }
});

function updateAttendanceStats() {
    fetch('/CSE-7/CSE7_Frontend/attendance_folder/get_attendance_stats.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('presentCount').textContent = data.present;
            document.getElementById('absentCount').textContent = data.absent;
            document.getElementById('lateCount').textContent = data.late;
            document.getElementById('attendanceRate').textContent = `${data.rate}%`;
        })
        .catch(error => console.error('Error fetching stats:', error));
}

function loadAttendanceData(date = null) {
    const queryDate = date || document.getElementById('attendanceDate').value;
    fetch(`/CSE-7/CSE7_Frontend/attendance_folder/get_attendance.php?date=${queryDate}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('attendanceTableBody');
            tbody.innerHTML = '';
            
            data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.employee_name}</td>
                    <td>${record.time_in || '-'}</td>
                    <td>${record.time_out || '-'}</td>
                    <td>
                        <span class="status-badge status-${record.status.toLowerCase()}">
                            ${record.status}
                        </span>
                    </td>
                    <td>${record.working_hours || '-'}</td>
                    <td>
                        <button class="edit-btn" onclick="editAttendance(${record.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading attendance:', error));
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateAttendanceStats();
    loadAttendanceData(new Date().toISOString().split('T')[0]);
    
    // Set up date change handler
    document.getElementById('attendanceDate').addEventListener('change', function() {
        loadAttendanceData(this.value);
    });
});

// Dispatch custom event when attendance is updated
function dispatchAttendanceUpdate() {
    document.dispatchEvent(new CustomEvent('attendanceUpdated'));
}

// Listen for attendance updates
document.addEventListener('attendanceUpdated', function() {
    updateAttendanceStats();
    loadAttendanceData();
});

// Fire custom event to initialize attendance components
document.dispatchEvent(new Event('AttendanceLoaded'));
