// Add this at the top, outside any function
let employees = []; // Global employees array

document.addEventListener('Employeeloaded', function() {
    fetchEmployees();
    initializeEmployeeModal();
    initializePayrollModal();
    fetchAndUpdateStats();

});

function calculateSalary(dailyRate, daysWorked) {
    return (parseFloat(dailyRate) * parseInt(daysWorked)).toFixed(2);
}

// Fix the renderStatusDropdown function to pass emp_id instead of status
function renderStatusDropdown(currentStatus, empId) {  // Add empId parameter
    const statusOptions = [
        { value: 'active', label: 'Active', color: '#4cd964', background: '#e8f5e9' },
        { value: 'onleave', label: 'On Leave', color: '#ff9500', background: '#fff3e0' },
        { value: 'inactive', label: 'Inactive', color: '#ff3b30', background: '#ffebee' }
    ];

    return `
        <select class="status-select-employee ${currentStatus}" 
                onchange="handleEmployeeStatusChange(this, '${empId}')"
                data-employee-id="${empId}">
            ${statusOptions.map(option => `
                <option value="${option.value}" 
                        ${currentStatus === option.value ? 'selected' : ''}>
                    ${option.label}
                </option>
            `).join('')}
        </select>
    `;
}

// Update the updateStatusColor function to ensure it persists
function updateStatusColor(select) {
    const styles = {
        active: { color: '#4cd964', background: '#e8f5e9' },
        onleave: { color: '#ff9500', background: '#fff3e0' },
        inactive: { color: '#ff3b30', background: '#ffebee' }
    };

    const value = select.value;
    // Keep the employee-specific class
    select.className = 'status-select-employee ' + value;

    const style = styles[value] || styles.active;
    select.style.color = style.color;
    select.style.backgroundColor = style.background;
}

// Fix the handleStatusChange function
function handleEmployeeStatusChange(select, employeeId) {
    if (!employeeId) {
        console.error('Employee ID is missing');
        return;
    }
    
    updateStatusColor(select);
    updateEmployeeStatus(employeeId, select.value);
}

// Update the updateEmployeeStatus function
function updateEmployeeStatus(employeeId, status) {
    console.log('Updating status:', employeeId, status);
    
    const select = document.querySelector(`select[data-employee-id="${employeeId}"]`);
    if (select) {
        select.disabled = true;
        // Store the original value in case we need to revert
        const originalValue = select.value;
    }

    fetch('/CSE-7/CSE7_Frontend/employee_folder/update_employee.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: employeeId,
            type: 'status',
            value: status
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data); // Debug log
        
        if (data.success) {
            // Update was successful
            showStatusUpdateToast(status);
            
            // Update the local employees array
            const employeeIndex = employees.findIndex(emp => emp.emp_id === employeeId);
            if (employeeIndex !== -1) {
                employees[employeeIndex].status = status;
            }
            
            // Update the select element's color
            if (select) {
                updateStatusColor(select);
            }
        } else {
            throw new Error(data.message || 'Failed to update status');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update status: ' + error.message);
        
        // Revert the select to its original value
        if (select && originalValue) {
            select.value = originalValue;
            updateStatusColor(select);
        }
    })
    .finally(() => {
        if (select) {
            select.disabled = false;
        }
    });
}

// Modify the fetchEmployees function to pass emp_id
function fetchEmployees() {
    getEmployeeData()
        .then(employeeData => {
            employees = employeeData; // Store the data in the global array
            console.log('Employees:', employees); // Debug log
            const tbody = document.getElementById('employeeTableBody');
            if (!tbody) return;

            tbody.innerHTML = '';
            
            if (employeeData.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="no-data">No employees found</td>
                    </tr>
                `;
                return;
            }

            employeeData.forEach(emp => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="employee-name">
                            <div class="employee-avatar">${emp.name.charAt(0)}</div>
                            ${emp.name}
                        </div>
                    </td>
                    <td>${emp.position}</td>
                    <td>₱${emp.dailyRate}</td>
                    <td>${emp.daysWorked}</td>
                    <td>${emp.contact}</td>
                    <td class="status-cell">
                        ${renderStatusDropdown(emp.status, emp.emp_id)} 
                    </td>
                    <td>
                        <div class="dropdown">
                            <button class="dropdown-trigger">
                                Actions
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu">
                                <button onclick="editEmployee('${emp.emp_id}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button onclick="viewPayroll('${emp.emp_id}')">
                                    <i class="fas fa-file-invoice-dollar"></i> View Payroll
                                </button>
                                <button onclick="viewEmployeeTasks('${emp.emp_id}')">
                                    <i class="fas fa-tasks"></i> View Tasks
                                </button>
                                <button class="delete-btn" onclick="deleteEmployee('${emp.emp_id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);

                // Initialize the status color for this row
                const statusSelect = row.querySelector('.status-select-employee');
                if (statusSelect) {
                    updateStatusColor(statusSelect);
                }
            });

            // Initialize dropdowns after adding them to the DOM
            initializeDropdowns();
        })
        .catch(error => {
            console.error('Error in fetchEmployees:', error);
            const tbody = document.getElementById('employeeTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="error-message">
                            Failed to load employees. Please try refreshing the page.
                        </td>
                    </tr>
                `;
            }
        });
}

// Make sure getEmployeeData is returning the correct data structure
async function getEmployeeData() {
    try {
        const response = await fetch('/CSE-7/CSE7_Frontend/employee_folder/get_employees.php', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status); // Debug log

        const result = await response.json();
        console.log('Response data:', result); // Debug log

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch employees');
        }

        // Map each employee to include both attendance and payroll data
        return Array.isArray(result.data) ? result.data.map(emp => ({
            id: emp.emp_id,
            emp_id: emp.emp_id,
            name: emp.name,
            position: emp.position,
            dailyRate: emp.daily_rate,
            // Attendance data (if available)
            daysWorked: emp.attendance ? emp.attendance.days_present : '0',
            totalMinutesLate: emp.attendance ? emp.attendance.total_minutes_late : '0',
            totalHoursLate: emp.attendance ? emp.attendance.total_hours_late : '0',
            effectiveDays: emp.attendance ? emp.attendance.effective_days : '0',
            // Payroll details computed on the backend
            payroll: emp.payroll ? emp.payroll : {},
            contact: emp.contact,
            status: emp.status || 'active',
            created_at: emp.created_at
        })) : [];

    } catch (error) {
        console.error('Detailed error:', error);
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            console.error('Network error or CORS issue');
        }
        throw error; // Re-throw to be handled by the calling function
    }
}

function formatStatus(status) {
    const statusMap = {
        'active': 'Active',
        'onleave': 'On Leave',
        'inactive': 'Inactive'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

function viewPayroll(employeeId) {
    const modal = document.getElementById('payrollModal');
    if (!modal) {
        console.error('Payroll modal not found');
        return;
    }

    const employee = findEmployee(employeeId);
    if (!employee) {
        alert('Employee not found');
        return;
    }

    // Display the modal
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.opacity = 1;
    modal.style.visibility = "visible";
    
    // Update modal header and populate pay periods
    updatePayrollHeader(employee);
    populatePayPeriods(employeeId);
    
    // Use the payroll details from the employee object
    fetchPayrollDetails(employeeId);
}

function findEmployee(emp_id) {
    // Convert emp_id to string for consistent comparison
    const searchId = String(emp_id);
    
    // Find employee by comparing string versions of IDs (assuming 'employees' is a global variable)
    const employee = employees.find(emp => String(emp.emp_id) === searchId);
    
    if (!employee) {
        console.error(`Employee with ID ${searchId} not found`);
        return null;
    }
    
    return employee;
}

function updatePayrollHeader(employee) {
    const avatar = document.getElementById('employeeAvatar');
    const name = document.getElementById('employeeName');
    const position = document.getElementById('employeePosition');

    if (!avatar || !name || !position) {
        console.error('One or more payroll header elements not found');
        return;
    }

    avatar.textContent = employee.name.charAt(0);
    name.textContent = employee.name;
    position.textContent = employee.position;
}

// Generates a select list of weekly periods (Monday to Sunday for the last 6 weeks)
// and attaches an event listener that calls fetchPayrollDetails when a period is chosen.
function populatePayPeriods(employeeId) {
    const periodSelect = document.getElementById('payrollPeriod');
    periodSelect.innerHTML = '<option value="">Select Pay Period</option>';
    
    // Get today's date and calculate the current week's Monday and Sunday.
    let currentDate = new Date();
    let dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
    // If today is Sunday (0), subtract 6 days; otherwise subtract (dayOfWeek - 1)
    let diffToMonday = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
    let monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - diffToMonday);
    let sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    // Generate the last 6 weekly periods (each Monday to Sunday)
    for (let i = 0; i < 6; i++) {
        // Clone the current Monday and Sunday for this period.
        let periodStart = new Date(monday);
        let periodEnd = new Date(sunday);
        let startStr = periodStart.toISOString().split('T')[0];
        let endStr = periodEnd.toISOString().split('T')[0];
        let periodValue = `${startStr}_${endStr}`;
        let periodLabel = `${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`;
        const option = new Option(periodLabel, periodValue);
        periodSelect.add(option);
        
        // Move back one week
        monday.setDate(monday.getDate() - 7);
        sunday.setDate(sunday.getDate() - 7);
    }
    
    // When the user selects a pay period, fetch the payroll details for that week.
    periodSelect.addEventListener('change', function() {
        if (this.value) {
            const [start, end] = this.value.split('_');
            fetchPayrollDetails(employeeId, start, end);
        }
    });
}

// Fetch payroll details for a specific employee and weekly period.
// The function builds a URL with query parameters so that the backend calculates payroll
// using the provided periodStart and periodEnd.
function fetchPayrollDetails(employeeId, start, end) {
    const url = `/CSE-7/CSE7_Frontend/employee_folder/get_employees.php?employeeId=${employeeId}&periodStart=${start}&periodEnd=${end}`;
    
    fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        if (!result.success) {
            console.error('Error:', result.message);
            return;
        }
        // The backend returns an array of employee objects.
        // Find the one with the matching employeeId.
        const employee = result.data.find(emp => String(emp.emp_id) === String(employeeId));
        if (employee && employee.payroll) {
            console.log('Payroll details:', employee.payroll);  
            displayPayrollDetails(employee.payroll);
        } else {
            console.error('Payroll details not found for employee', employeeId);
        }
    })
    .catch(error => {
        console.error('Error fetching payroll details:', error);
    });
}

// Display payroll details in the payroll modal.
function displayPayrollDetails(details) {
    const content = document.getElementById('payrollContent');
    if (!content) return;

    console.log("Payroll grosspar:", details.grossPay.toFixed(2)); // Debug log
    content.innerHTML = `
        <div class="payroll-details">
            <div class="payroll-summary">
                <div class="summary-item">
                    <div class="summary-label">Gross Pay</div>
                    <div class="summary-value">₱${details.grossPay.toFixed(2)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Total Deductions</div>
                    <div class="summary-value">₱${Object.values(details.deductions).reduce((a, b) => a + b, 0).toFixed(2)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Net Pay</div>
                    <div class="summary-value">₱${details.netPay.toFixed(2)}</div>
                </div>
            </div>
            
            <div class="payroll-breakdown">
                <h4>Earnings</h4>
                <div class="payroll-item">
                    <span>Base Pay (${details.daysWorked} days @ ₱${details.dailyRate}/day)</span>
                    <span>₱${details.grossPay.toFixed(2)}</span>
                </div>

                <h4>Deductions</h4>
                ${Object.entries(details.deductions).map(([key, value]) => `
                    <div class="deduction-item">
                        <span>${key.toUpperCase()}</span>
                        <span>₱${value.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}


function printPayroll() {
    window.print();
}

function editEmployee(id) {
    // Implement edit functionality
    console.log('Editing employee:', id);
}

function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
        return;
    }

    // Find the row and add loading state
    const row = document.querySelector(`tr:has(button[onclick*="deleteEmployee('${id}')"])`);
    if (row) {
        row.classList.add('deleting');
    }

    fetch('/CSE-7/CSE7_Frontend/employee_folder/delete_employee.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove employee from local array
            employees = employees.filter(emp => emp.emp_id !== id);
            
            // Animate row removal
            if (row) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    row.remove();
                    // Check if table is empty
                    if (employees.length === 0) {
                        const tbody = document.getElementById('employeeTableBody');
                        if (tbody) {
                            tbody.innerHTML = `
                                <tr>
                                    <td colspan="7" class="no-data">No employees found</td>
                                </tr>
                            `;
                        }
                    }
                }, 300);
            }
            
            // Show success message
            const toast = document.createElement('div');
            toast.className = 'status-toast status-success';
            toast.textContent = 'Employee deleted successfully';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } else {
            throw new Error(data.message || 'Failed to delete employee');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting employee: ' + error.message);
        // Remove loading state if error
        if (row) {
            row.classList.remove('deleting');
        }
    });
}

// Add this CSS for delete animation
const deleteStyle = document.createElement('style');
deleteStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    tr.deleting {
        opacity: 0.5;
        pointer-events: none;
    }
    
    .status-toast.status-success {
        background-color: #4cd964;
        color: white;
    }
`;
document.head.appendChild(deleteStyle);

function showStatusUpdateToast(status) {
    const toast = document.createElement('div');
    toast.className = `status-toast status-${status}`;
    toast.textContent = `Status updated to ${formatStatus(status)}`;
    document.body.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Move closeModal outside of initializeEmployeeModal
function closeModal() {
    const modal = document.getElementById("addEmployeeModal");
    const form = document.getElementById("addEmployeeForm");
    if (modal && form) {
        modal.style.display = "none";
        form.reset();
    }
}

function initializeEmployeeModal() {
    var modal = document.getElementById("addEmployeeModal");
    var btn = document.querySelector(".add_btn_employee");
    var closeBtn = document.querySelector(".close");
    var cancelBtn = document.querySelector(".cancel");
    var form = document.getElementById("addEmployeeForm");

    if (modal && btn && closeBtn && form) {
        // Show modal when button is clicked
        btn.onclick = function () {
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.opacity = 1;
            modal.style.visibility = "visible";
        };

        // Use the global closeModal function
        closeBtn.onclick = closeModal;
        if (cancelBtn) {
            cancelBtn.onclick = closeModal;
        }

        // Close modal when clicking outside
        window.onclick = function (event) {
            if (event.target === modal) {
                closeModal();
            }
        };

        // Form submission handler
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            
            // Add the full name to the form data
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            formData.set('employeeName', `${firstName} ${lastName}`);

            // Add loading state to submit button
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Adding...';
            submitBtn.disabled = true;

            fetch("/CSE-7/CSE7_Frontend/employee_folder/add_employee.php", {
                method: "POST",
                body: formData,
                credentials: 'include' // Important for sessions
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Employee added successfully!");
                    closeModal();
                    // Refresh employee list
                    fetchEmployees();
                } else {
                    throw new Error(data.message || 'Failed to add employee');
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error adding employee: " + error.message);
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

function initializePayrollModal() {
    const modal = document.getElementById('payrollModal');
    const closeBtn = modal?.querySelector('.close');
    
    if (!modal) {
        console.error('Payroll modal not found');
        return;
    }

    // Close button handler
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            // Clear the payroll content when closing
            document.getElementById('payrollContent').innerHTML = '';
            document.getElementById('payrollPeriod').value = '';
        };
    }

    // Close on outside click
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            // Clear the payroll content when closing
            document.getElementById('payrollContent').innerHTML = '';
            document.getElementById('payrollPeriod').value = '';
        }
    };
}

// Add these new functions
function initializeDropdowns() {
    // Create backdrop element if it doesn't exist
    let backdrop = document.querySelector('.dropdown-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'dropdown-backdrop';
        document.body.appendChild(backdrop);
    }

    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = trigger.closest('.dropdown');
            const currentDropdown = trigger.nextElementSibling;
            const isOpen = currentDropdown.classList.contains('show');
            
            // Close all dropdowns first
            closeAllDropdowns();
            
            // Toggle current dropdown if it wasn't open
            if (!isOpen) {
                currentDropdown.classList.add('show');
                trigger.classList.add('active');
                dropdown.classList.add('active'); // Add active to container
                backdrop.classList.add('show');
                
                // Position the dropdown
                positionDropdown(currentDropdown, trigger);
            }
        });
    });

    // Close dropdowns when clicking outside
    backdrop.addEventListener('click', closeAllDropdowns);
    
    // Close dropdowns when scrolling
    document.addEventListener('scroll', closeAllDropdowns);
}

function positionDropdown(dropdown, trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Reset any previous positioning
    dropdown.style.top = '100%';
    dropdown.style.bottom = 'auto';
    dropdown.style.left = '';
    dropdown.style.right = '';
    dropdown.classList.remove('edge');
    
    // Check if dropdown would go off-screen horizontally
    if (triggerRect.right - dropdown.offsetWidth < 0) {
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';
        dropdown.classList.add('edge');
    }

    // Ensure the dropdown is visible by scrolling if necessary
    setTimeout(() => {
        const dropdownRect = dropdown.getBoundingClientRect();
        if (dropdownRect.bottom > window.innerHeight) {
            window.scrollBy({
                top: dropdownRect.bottom - window.innerHeight + 10,
                behavior: 'smooth'
            });
        }
    }, 0);
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
    
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
    
    document.querySelector('.dropdown-backdrop')?.classList.remove('show');
}


// Close modal when clicking outside or on close button
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addEmployeeModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelector('#addEmployeeModal .close')?.addEventListener('click', function() {
    document.getElementById('addEmployeeModal').style.display = "none";
});

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
    .status-select-employee {
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .status-select-employee.active {
        color: #4cd964;
        background-color: #e8f5e9;
    }

    .status-select-employee.onleave {
        color: #ff9500;
        background-color: #fff3e0;
    }

    .status-select-employee.inactive {
        color: #ff3b30;
        background-color: #ffebee;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize status selects
    document.querySelectorAll('.status-select-employee').forEach(updateStatusColor);
});
function showModal(modal) {
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.opacity = 1;
    modal.style.visibility = "visible";
}

// Default sample data (will be overwritten by dynamic data)
let sampleEmployee = {
    name: "John Doe",
    position: "Farm Supervisor",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random"
};

let sampleTasks = [
    {
        id: 1,
        title: "Harvest Tomatoes",
        description: "Harvest ripe tomatoes from Field A",
        status: "pending",
        priority: "high",
        startDate: "2024-01-20",
        endDate: "2024-01-21",
        location: "Field A"
    },
    {
        id: 2,
        title: "Apply Fertilizer",
        description: "Apply organic fertilizer to corn field",
        status: "in_progress",
        priority: "medium",
        startDate: "2024-01-19",
        endDate: "2024-01-19",
        location: "Field B"
    },
    {
        id: 3,
        title: "Irrigation System Check",
        description: "Perform maintenance check on irrigation system",
        status: "completed",
        priority: "low",
        startDate: "2024-01-18",
        endDate: "2024-01-18",
        location: "All Fields"
    }
];

function populateTaskModal() {
    // Set employee details
    const employeeNameEl = document.getElementById('taskEmployeeName');
    const employeePositionEl = document.getElementById('taskEmployeePosition');
    const employeeAvatarEl = document.getElementById('taskEmployeeAvatar');

    if (employeeNameEl) {
        employeeNameEl.textContent = sampleEmployee.name;
    }
    if (employeePositionEl) {
        employeePositionEl.textContent = sampleEmployee.position;
    }
    if (employeeAvatarEl) {
        employeeAvatarEl.style.backgroundImage = `url(${sampleEmployee.avatar})`;
    }

    // Populate task list
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    taskList.innerHTML = ''; // Clear existing tasks

    if (Array.isArray(sampleTasks) && sampleTasks.length > 0) {
        sampleTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.status}`;
            taskElement.innerHTML = `
                <div class="task-header">
                    <h4>${task.title}</h4>
                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                </div>
                <p>${task.description}</p>
                <div class="task-footer">
                    <span class="task-date">📅 ${task.startDate} - ${task.endDate}</span>
                    <span class="task-location">📍 ${task.location}</span>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    } else {
        taskList.innerHTML = '<p>No tasks assigned.</p>';
    }
}

// Add event listener for the task status filter
document.getElementById('taskStatusFilter').addEventListener('change', function(e) {
    const status = e.target.value;
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        if (status === 'all' || task.classList.contains(status)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
});

// This function is called when the "View Tasks" button is clicked
function viewEmployeeTasks(employeeID) {
    const viewTaskModal = document.getElementById('viewTaskModal');
    if (!viewTaskModal) return;

    // Close modal when clicking the close button
    const closeBtn = viewTaskModal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            viewTaskModal.style.display = 'none';
        };
    }

    // Attach a handler for a cancel button if one exists
    const cancelBtn = viewTaskModal.querySelector('.cancel');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            viewTaskModal.style.display = 'none';
        };
    }

    // Fetch dynamic data and then show the modal
    fetch(`/CSE-7/CSE7_Frontend/employee_folder/get_employee_task.php?employee_id=${employeeID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sampleEmployee = data.employee;
                sampleTasks = data.tasks;
                populateTaskModal();
            } else {
                console.error("Error fetching tasks:", data.message);
            }
            showModal(viewTaskModal);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            showModal(viewTaskModal);
        });
}


// Function to update stat cards
function updateStats(stats) {
    // Select each stat card's value element
    const totalEmployeesEl = document.querySelector('.employee-stats .stat-card:nth-child(1) .stat-value');
    const activeTodayEl    = document.querySelector('.employee-stats .stat-card:nth-child(2) .stat-value');
    const onLeaveEl        = document.querySelector('.employee-stats .stat-card:nth-child(3) .stat-value');
    const totalPayrollEl   = document.querySelector('.employee-stats .stat-card:nth-child(4) .stat-value');

    if (totalEmployeesEl) totalEmployeesEl.textContent = stats.totalEmployees;
    if (activeTodayEl)    activeTodayEl.textContent = stats.activeToday;
    if (onLeaveEl)        onLeaveEl.textContent = stats.onLeave;
    if (totalPayrollEl)   totalPayrollEl.textContent = stats.totalPayroll;
    console.log("Employee payroll: " + stats.totalPayroll);
    console.log("Employee On leave: " + stats.onLeave);
}

// Function to fetch stats from the backend API and update the cards
function fetchAndUpdateStats() {
    // Replace the URL below with your actual backend API endpoint
    fetch('/CSE-7/CSE7_Frontend/employee_folder/get_employee_stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Assume your API returns a JSON object like:
                // { success: true, stats: { totalEmployees: 24, activeToday: 18, onLeave: 3, totalPayroll: "₱45,200" } }
                updateStats(data.stats);
            } else {
                console.error("Failed to load stats:", data.message);
            }
        })
        .catch(error => console.error("Error fetching stats:", error));
}

// Call this function on page load or whenever you need to refresh the stats
