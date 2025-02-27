<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/employee.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>Employee Management</title>
</head>
<body>
    <div class="employee-container">
        <!-- Stats Section -->
        <div class="employee-stats">
            <div class="stat-card">
                <i class="fas fa-users stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Total Employees</div>
                    <div class="stat-value">24</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-user-check stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Active Today</div>
                    <div class="stat-value">18</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-user-clock stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">On Leave</div>
                    <div class="stat-value">3</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-money-bill-wave stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Total Payroll</div>
                    <div class="stat-value">₱45,200</div>
                </div>
            </div>
        </div>

        <!-- Header with Actions -->
        <div class="page-header">
            <h1><i class="fas fa-users-gear"></i> Employee Management</h1>
            <button class="add_btn_employee" id="addEmployeeBtn">
                <i class="fas fa-plus"></i>
                Add Employee
            </button>
        </div>

        <!-- Filters -->
        <div class="employee-filters">
            <div class="search-wrapper">
                <i class="fas fa-search search-icon"></i>
                <input type="text" placeholder="Search employees...">
            </div>
            <div class="filter-controls">
                <div class="filter-group">
                    <select class="filter-dropdown">
                        <option value="">🏢 All Departments</option>
                        <option value="farm">🌾 Farm Workers</option>
                        <option value="admin">👔 Administrative</option>
                        <option value="management">👥 Management</option>
                    </select>
                    <select class="filter-dropdown">
                        <option value="">📊 Status</option>
                        <option value="active">🟢 Active</option>
                        <option value="leave">🟡 On Leave</option>
                        <option value="inactive">🔴 Inactive</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Employee Table -->
        <div class="employee-table">
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Position</th>
                        <th>Daily Rate</th>
                        <th>Days Worked</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="employeeTableBody">
                    <tr>
                        <td>Robert Jhon D. Aracena</td>
                        <td>Fruit Picker</td>
                        <td>400</td>
                        <td>6</td>
                        <td>098968953</td>
                        <td>Active</td>
                        <td>
                            <div class="Employee_Actions_Button">
                                <button class="edit_employee">edit</button>
                                <button class="del_employee">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal template remains the same -->
    <!-- ... existing modal code ... -->

    <!-- Payroll Modal -->
    <div id="payrollModal" class="modal">
        <div class="modal-content payroll-modal">
            <button class="close">&times;</button>
            <div class="modal-header">
                <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
                <h2>Employee Payroll</h2>
            </div>
            <div class="payroll-container">
                <div class="payroll-header">