// Add this at the top, outside any function
let employees = []; // Global employees array

document.addEventListener('Employeeloaded', function() {
    fetchEmployees();
    initializeEmployeeModal();
    initializePayrollModal();
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
            employees = employeeData;
            const tbody = document.getElementById('employeeTableBody');
            if (!tbody) return;

            tbody.innerHTML = '';
            
            if (employees.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="no-data">No employees found</td>
                    </tr>
                `;
                return;
            }

            employees.forEach(emp => {
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

        return Array.isArray(result.data) ? result.data.map(emp => ({
            id: emp.emp_id,
            emp_id: emp.emp_id,
            name: emp.name,
            position: emp.position,
            dailyRate: emp.daily_rate,
            daysWorked: '0',
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
    
    // Update modal content
    updatePayrollHeader(employee);
    populatePayPeriods(employeeId);
    fetchPayrollDetails(employeeId);
}

function findEmployee(emp_id) {
    // Now this will work because employees is globally accessible
    const employee = employees.find(emp => emp.emp_id === emp_id);
    if (!employee) {
        console.error(`Employee with ID ${emp_id} not found`);
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

function populatePayPeriods(employeeId) {
    // This should be replaced with an actual API call
    const periodSelect = document.getElementById('payrollPeriod');
    const currentDate = new Date();
    
    // Generate last 6 pay periods (bimonthly)
    periodSelect.innerHTML = '<option value="">Select Pay Period</option>';
    
    for(let i = 0; i < 6; i++) {
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i === 0 ? currentDate.getDate() : 15);
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i === 0 ? 16 : 1);
        
        const periodValue = `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
        const periodLabel = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        
        const option = new Option(periodLabel, periodValue);
        periodSelect.add(option);
        
        currentDate.setDate(currentDate.getDate() - 15); // Move to previous period
    }
    
    // Add change event listener
    periodSelect.addEventListener('change', function() {
        if (this.value) {
            const [start, end] = this.value.split('_');
            fetchPayrollDetails(employeeId, start, end);
        }
    });
}

function fetchPayrollDetails(employeeId, start, end) {
    // Implement API call to get payroll details
    // For now using mock data
    const payrollDetails = {
        employeeId: employeeId,
        periodStart: start || '2024-03-01',
        periodEnd: end || '2024-03-15',
        daysWorked: 22,
        dailyRate: 500,
        grossPay: 11000,
        deductions: {
            tax: 500,
            sss: 300,
            philhealth: 200,
            pagibig: 100
        },
        netPay: 9900
    };

    displayPayrollDetails(payrollDetails);
}

function displayPayrollDetails(details) {
    const content = document.getElementById('payrollContent');
    if (!content) return;

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

function viewEmployeeTasks(employeeId) {
    const employee = findEmployee(employeeId);
    if (!employee) return;

    // Implement your task viewing logic here
    console.log(`Viewing tasks for employee: ${employee.name}`);
    // This would typically open a modal or navigate to a task view
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
