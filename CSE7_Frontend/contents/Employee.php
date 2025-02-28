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
                <input type="text" id="employeeSearch" placeholder="Search employees..." autocomplete="off">
                <div id="searchResults" class="search-results"></div>
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

    <!-- Add this debug element -->
    <div id="debugInfo" style="display:none;"></div>

    <!-- Make sure search_employee.js is loaded before employee.js -->
    <script>
        // Debug function
        function debugSearch() {
            const debugInfo = document.getElementById('debugInfo');
            const searchInput = document.getElementById('employeeSearch');
            const searchResults = document.getElementById('searchResults');
            
            debugInfo.innerHTML = `
                Search Input exists: ${!!searchInput}<br>
                Search Results exists: ${!!searchResults}<br>
            `;
        }
        
        // Run debug after a short delay
        setTimeout(debugSearch, 1000);
    </script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/search_employee.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/employee.js"></script>
    
    <!-- Trigger contentLoaded event after everything is ready -->
    <script>
        document.dispatchEvent(new Event('contentLoaded'));
    </script>
</body>
</html>
