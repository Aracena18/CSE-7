document.addEventListener('AttendanceLoaded', function() {
    // Initialize
    loadAttendanceData();
    updateAttendanceStats();
    initializeEventListeners();
});

let hasRecordAttendanceFormListener = false;
let isSubmitting = false;

function initializeEventListeners() {
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
        dateInput.addEventListener('change', () => loadAttendanceData());
    }

    const recordBtn = document.getElementById('recordAttendanceBtn');
    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            const modal = document.getElementById('recordAttendanceModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
            }
        });
    }
}

function loadAttendanceData() {
    const tbody = document.getElementById('attendanceTableBody');
    const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().split('T')[0];

    if (!tbody) return;

    // Show loading state
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                <div class="loading">Loading attendance records...</div>
            </td>
        </tr>
    `;

    fetch(`/CSE-7/CSE7_Frontend/attendance_folder/get_attendance.php?date=${date}`)
        .then(response => response.json())
        .then(data => {
            tbody.innerHTML = '';

            if (!data.success || !data.data || data.data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">No attendance records found</td>
                    </tr>
                `;
                return;
            }

            data.data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="checkbox-column">
                        <input type="checkbox" class="task-checkbox" 
                            onchange="updateAttendance(${record.id}, this.checked)"
                            ${record.time_out ? 'checked disabled' : ''}
                        >
                    </td>
                    <td>
                        <div class="employee-name">
                            <div class="employee-avatar">${record.employee_name.charAt(0)}</div>
                            ${record.employee_name}
                        </div>
                    </td>
                    <td>${record.time_in || '-'}</td>
                    <td>${record.time_out || '-'}</td>
                    <td>
                        <span class="status-badge ${record.status}">
                            ${formatStatus(record.status)}
                        </span>
                    </td>
                    <td>${record.working_hours || '-'}</td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="editAttendance('${record.id}')" class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>

                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center error">
                        Failed to load attendance records
                    </td>
                </tr>
            `;
        });
}

// Funtion for editing attendance
function editAttendance(id) {
    console.log('Edit attendance:', id);
}


// Function for updating attendance time out
// Update the existing updateAttendance function:

function updateAttendance(id, checked) {
    if (!checked) return; // Only proceed if checkbox is checked

    const confirmation = confirm('Are you sure you want to record time out for this employee?');
    if (!confirmation) {
        // Uncheck the checkbox if user cancels
        const checkbox = document.querySelector(`input[type="checkbox"][onchange*="${id}"]`);
        if (checkbox) checkbox.checked = false;
        return;
    }

    fetch(`/CSE-7/CSE7_Frontend/attendance_folder/updateAttendance.php?id=${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Time out recorded successfully', 'success');
            
            // Disable the checkbox after successful update
            const checkbox = document.querySelector(`input[type="checkbox"][onchange*="${id}"]`);
            if (checkbox) {
                checkbox.disabled = true;
                checkbox.checked = true;
            }
            
            // Refresh the attendance data
            loadAttendanceData();
            updateAttendanceStats();
        } else {
            showNotification(data.message || 'Failed to update attendance', 'error');
            // Uncheck the checkbox if update failed
            const checkbox = document.querySelector(`input[type="checkbox"][onchange*="${id}"]`);
            if (checkbox) checkbox.checked = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error updating attendance', 'error');
        // Uncheck the checkbox if there was an error
        const checkbox = document.querySelector(`input[type="checkbox"][onchange*="${id}"]`);
        if (checkbox) checkbox.checked = false;
    });
}


function formatStatus(status) {
    const statusMap = {
        'present': 'Present',
        'absent': 'Absent',
        'late': 'Late'
    };
    return statusMap[status] || status;
}

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

    // Set current date in a readable format
    const today = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateInput.value = today.toLocaleDateString('en-US', dateOptions);

    // Time In button handler
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

        // Mark as late if after 9:00 AM
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const status = document.getElementById('status');
        status.value = (hour > 9 || (hour === 9 && minutes > 0)) ? 'late' : 'present';
    });

    // Time Out button handler
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

    // Reset form helper
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
    
    let isSubmitting = false; // Submission lock flag

    // Only attach the submit listener if not already attached
    if (!form.dataset.listenerAttached) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSubmitting) return;

            isSubmitting = true;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalButtonText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            try {
                const formData = new FormData(form);
                const response = await fetch('/CSE-7/CSE7_Frontend/attendance_folder/record_attendance.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    showNotification('Attendance recorded successfully', 'success');
                    closeAndResetModal();
                    loadAttendanceData();
                    updateAttendanceStats();
                    resetForm();
                } else {
                    showNotification(data.message || 'Failed to record attendance', 'error');
                    console.error('Submission error:', data);
                    closeAndResetModal();
                    resetForm();
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('An error occurred while recording attendance', 'error');
                closeAndResetModal();
                resetForm();
            } finally {
                isSubmitting = false;
                submitBtn.disabled = false;
                submitBtn.textContent = originalButtonText;
            }
        });
        form.dataset.listenerAttached = 'true'; // Mark the listener as attached
    }
    
    // Helper function to close and reset modal
    function closeAndResetModal() {
        if (modal) {
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
        }
        if (form) {
            form.reset();
        }
        if (timeInBtn) {
            timeInBtn.disabled = false;
            timeInBtn.classList.remove('recorded');
            timeInBtn.textContent = 'Record Time In';
        }
        if (timeOutBtn) {
            timeOutBtn.disabled = true;
            timeOutBtn.classList.remove('recorded');
            timeOutBtn.textContent = 'Record Time Out';
        }
        const searchResults = document.getElementById('employeeSearchResults');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }

    // Cleanup helper to re-enable submit button if needed
    const cleanup = () => {
        isSubmitting = false;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save';
        }
    };

    // Attach close event handlers (no duplicate binding assumed for these)
    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            modal.style.display = 'none';
            resetForm();
            cleanup();
        });
    });

    // Close modal when clicking outside it
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

document.addEventListener('AttendanceLoaded', function() {
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
    console.log('🔄 Starting updateAttendanceStats...');
    
    // Verify elements exist before proceeding
    const elements = {
        presentCount: document.getElementById('presentCount'),
        absentCount: document.getElementById('absentCount'),
        lateCount: document.getElementById('lateCount'),
        attendanceRate: document.getElementById('attendanceRate')
    };

    // Check if all required elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('❌ Missing DOM elements:', missingElements);
        return; // Exit if any elements are missing
    }

    console.log('✅ All required DOM elements found');
    
    fetch('/CSE-7/CSE7_Frontend/attendance_folder/get_attendance_stats.php')
        .then(response => {
            console.log('📥 Response status:', response.status);
            console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Log the raw response text for debugging
            return response.text().then(text => {
                console.log('📄 Raw response:', text);
                try {
                    return JSON.parse(text); // Try to parse the response
                } catch (e) {
                    console.error('❌ JSON Parse Error:', e);
                    console.error('❌ Invalid JSON received:', text);
                    throw new Error('Invalid JSON response from server');
                }
            });
        })
        .then(data => {
            console.log('📊 Parsed data:', data);
            
            if (!data) {
                throw new Error('No data received from server');
            }

            if (!data.success) {
                throw new Error(data.message || 'Server indicated failure');
            }

            // Validate data structure
            const requiredFields = ['present', 'absent', 'late', 'rate'];
            const missingFields = requiredFields.filter(field => typeof data[field] === 'undefined');
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Update stats with validation
            elements.presentCount.textContent = data.present;
            elements.absentCount.textContent = data.absent;
            elements.lateCount.textContent = data.late;
            elements.attendanceRate.textContent = `${data.rate}%`;

            console.log('✅ Stats updated successfully');
        })
        .catch(error => {
            console.error('❌ Error in updateAttendanceStats:', error);
            console.error('❌ Error stack:', error.stack);
            
            // Set default values with visual indication of error
            Object.values(elements).forEach(element => {
                element.textContent = '❌';
                element.style.color = 'red';
            });

            // Optionally show error to user
            const errorToast = document.createElement('div');
            errorToast.className = 'error-toast';
            errorToast.textContent = 'Failed to load attendance stats. Please refresh the page.';
            document.body.appendChild(errorToast);
            
            setTimeout(() => errorToast.remove(), 5000);
        });
}

// Add date change handler
document.getElementById('attendanceDate').addEventListener('change', function() {
    loadAttendanceData(this.value);
});

// Set default date to today
document.addEventListener('AttendanceLoaded', function() {
    console.log('🟢 DOM fully loaded');
    
    const tbody = document.getElementById('attendanceTableBody');
    const dateInput = document.getElementById('attendanceDate');
    
    if (!tbody) {
        console.error('❌ Could not find attendanceTableBody element');
    }
    if (!dateInput) {
        console.error('❌ Could not find attendanceDate element');
    }

    // Initialize only if elements exist
    if (tbody && dateInput) {
        console.log('✅ Found all required elements');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        
        // Load initial data
        loadAttendanceData(today);
        updateAttendanceStats();
        
        // Set up date change handler
        dateInput.addEventListener('change', function() {
            loadAttendanceData(this.value);
        });
    }
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

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.style.display = 'block'; // Ensure visibility
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';

    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'warning' ? 'fa-exclamation-triangle' : 
                          'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Append to body
    document.body.appendChild(toast);
    
    // Trigger reflow to ensure animation plays
    toast.offsetHeight;
    
    // Add fade-in effect
    toast.style.opacity = '1';
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.remove();
            }
        }, 500);
    }, 5000);
}
