<?php
    session_start();
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@350&display=swap" />
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/homepage.css">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/modal.css">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/content.css">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/employee.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>Document</title>
</head>
<body>
    <header>
        <div class="logo_container">
            <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" class="logo_dashboard">
        </div>
        <div class="search_container">
            <input type="text" class="search-box" placeholder="Search">
        </div>
        <div class="buttons_sets">
            <button class="button1" id="addCropBtn">
                <img src="/CSE-7/CSE7_Frontend/Assets/plus-circle.svg" alt="addbutton">
            </button>
            <button class="button1"><img src="/CSE-7/CSE7_Frontend/Assets/settings.svg" alt="settings"></button>
            <div class="user-dropdown">
                <button class="button1" id="userDropdownBtn">
                    <img src="/CSE-7/CSE7_Frontend/Assets/user.svg" alt="user">
                </button>
                <div class="dropdown-content" id="userDropdown">
                    <a href="profile.php">Profile</a>
                    <hr>
                    <a href="#settings">Settings</a>
                    <hr>
                    <a href="/CSE-7/CSE7_Frontend/authentication/logout.php">Logout</a>
                </div>
            </div>
        </div>
    </header>
    <section class="dashboard_sect">
        <aside class="sidebar">
            <nav>
                <ul class="sidebar_links">
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/Vector.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/schedulecontent.php')">Task</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/Group.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/schedule.php')">Schedule</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/game-icons_plants-and-animals.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/crops.php')">Crops</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/pepicons-pencil_persons.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/Employee.php')">Employee</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/attendance1.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/Attendance.php')">Attendance</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/Group 12.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/Sales.php')">Sales</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/Group 13.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/Production.php')">Production</a></li>
                    <li><img src="/CSE-7/CSE7_Frontend/Assets/brand logos/carbon_tools.svg" alt="">
                        <a href="#" onclick="loader('/CSE-7/CSE7_Frontend/contents/Resources.php')">Resources</a></li>
                </ul>
            </nav>
        </aside>
        <div class="main-content" id="main-content">
            <div class="content-wrapper" id="content-wrapper">
                <!-- Add this inside the content-wrapper div -->
                
            </div>
        </div>
    </section>

    <div id="addCropModal" class="modal">
        <div class="modal-content">
            <button class="close">&times;</button>
            <div class="modal-header">
                <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
                <h2>Add Crop</h2>
            </div>
            <form id="addCropForm" method="POST">
                <div class="form-container">
                    <input type="hidden" id="cropId" name="cropId">
                    <div class="form-group">
                        <label for="cropName">Crop Name</label>
                        <input type="text" id="cropName" name="cropName" required>
                    </div>
                    <div class="form-group">
                        <label for="plantingDate">Planting Date</label>
                        <input type="date" id="plantingDate" name="plantingDate" required>
                    </div>
                    <div class="form-group">
                        <label for="cropType">Crop Type</label>
                        <input type="text" id="cropType" name="cropType" required>
                    </div>
                    <div class="form-group">
                        <label for="expectedHarvestDate">Expected Harvest Date</label>
                        <input type="date" id="expectedHarvestDate" name="expectedHarvestDate" required>
                    </div>
                    <div class="form-group">
                        <label for="variety">Variety</label>
                        <input type="text" id="variety" name="variety" required>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantity</label>
                        <input type="text" id="quantity" name="quantity" required>
                    </div>
                    <div class="form-group full-width">
                        <label for="location">Location</label>
                        <input type="text" id="location" name="location" required>
                    </div>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="automateTask" name="automateTask">
                    <label for="automateTask">Automate Task</label>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="submit-btn" id="submitButton">Add Crop</button>
                    <button type="button" class="cancel">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Replace the existing addTaskModal content -->
<div id="addTaskModal" class="modal">
    <div class="modal-content">
        <button class="close_task">&times;</button>
        <div class="modal-header">
            <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
            <h2>Add Task</h2>
        </div>
        <form id="addTaskForm" method="POST">
            <div class="form-container">
                <div class="form-group">
                    <label for="taskDescription">Description</label>
                    <input type="text" id="taskDescription" name="taskDescription" required>
                </div>
                <div class="form-group">
                    <label for="assignedTo">Assigned to</label>
                    <input type="text" id="assignedTo" name="assignedTo" required>
                    <div id="assignedToResults" class="search-results"></div>
                </div>
                <div class="form-group">
                    <label for="cropSelect">Crop</label>
                    <select id="cropSelect" name="cropSelect" required>
                        <option value="">Select Crop</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="startDate">Start Date</label>
                    <input type="date" id="startDate" name="startDate" required>
                </div>
                <div class="form-group">
                    <label for="endDate">End Date</label>
                    <input type="date" id="endDate" name="endDate" required>
                </div>
                <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority" name="priority" class="priority-select" onchange="changePriorityColor(this)" required>
                        <option value="high" class="high">High</option>
                        <option value="medium" class="medium">Medium</option>
                        <option value="low" class="low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status" class="status-select" onchange="changeStatusColor(this)" required>
                        <option value="todo" class="todo">To Do</option>
                        <option value="inprogress" class="inprogress">In Progress</option>
                        <option value="completed" class="completed">Completed</option>
                        <option value="onhold" class="onhold">On Hold</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskLocation">Location</label>
                    <input type="text" id="taskLocation" name="taskLocation" required>
                </div>
            </div>
            <div class="form-buttons">
                <button type="submit" class="submit-btn">Add Task</button>
                <button type="button" class="cancel">Cancel</button>
            </div>
        </form>
    </div>
</div>



<div id="EditCropModal" class="modal">
        <div class="modal-content">
            <button class="close">&times;</button>
            <div class="modal-header">
                <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
                <h2>Edit Crop</h2>
            </div>
            <form id="editCropForm" method="POST">
                <div class="form-container">
                    <input type="hidden" id="cropId" name="cropId">
                    <div class="form-group">
                        <label for="cropName">Crop Name</label>
                        <input type="text" id="cropName" name="cropName" required>
                    </div>
                    <div class="form-group">
                        <label for="plantingDate">Planting Date</label>
                        <input type="date" id="plantingDate" name="plantingDate" required>
                    </div>
                    <div class="form-group">
                        <label for="cropType">Crop Type</label>
                        <input type="text" id="cropType" name="cropType" required>
                    </div>
                    <div class="form-group">
                        <label for="expectedHarvestDate">Expected Harvest Date</label>
                        <input type="date" id="expectedHarvestDate" name="expectedHarvestDate" required>
                    </div>
                    <div class="form-group">
                        <label for="variety">Variety</label>
                        <input type="text" id="variety" name="variety" required>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantity</label>
                        <input type="text" id="quantity" name="quantity" required>
                    </div>
                    <div class="form-group full-width">
                        <label for="location">Location</label>
                        <input type="text" id="location" name="location" required>
                    </div>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="automateTask" name="automateTask">
                    <label for="automateTask">Automate Task</label>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="submit-btn-Edit" id="submitButtonEdit">Update Crop</button>
                    <button type="button" class="cancel">Cancel</button>
                </div>
            </form>
        </div>
    </div>


    <!-- Replace the existing addTaskModal content -->
    <div id="EditTaskModal" class="modal">
    <div class="modal-content">
        <button class="close">&times;</button>
        <div class="modal-header">
            <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
            <h2>Edit Task</h2>
        </div>
        <form id="EditTaskForm" method="POST">
            <!-- Ensure hidden input is at the top of the form -->
            <input type="hidden" id="taskId" name="taskId">
            <div class="form-container">
                <div class="form-group">
                    <label for="taskDescription">Description</label>
                    <input type="text" id="taskDescription" name="taskDescription" required>
                </div>
                <div class="form-group">
                    <label for="assignedTo">Assigned to</label>
                    <input type="text" id="assignedTo" name="assignedTo" required>
                </div>
                <div class="form-group">
                    <label for="cropSelect">Crop</label>
                    <select id="cropSelectEdit" name="cropSelect" required>
                        <option value="">Select Crop</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="startDate">Start Date</label>
                    <input type="date" id="startDate" name="startDate" required>
                </div>
                <div class="form-group">
                    <label for="endDate">End Date</label>
                    <input type="date" id="endDate" name="endDate" required>
                </div>
                <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority" name="priority" class="priority-select" onchange="changePriorityColor(this)" required>
                        <option value="high" class="high">High</option>
                        <option value="medium" class="medium">Medium</option>
                        <option value="low" class="low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status" class="status-select" onchange="changeStatusColor(this)" required>
                        <option value="todo" class="todo">To Do</option>
                        <option value="inprogress" class="inprogress">In Progress</option>
                        <option value="completed" class="completed">Completed</option>
                        <option value="onhold" class="onhold">On Hold</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskLocation">Location</label>
                    <input type="text" id="taskLocation" name="taskLocation" required>
                </div>
            </div>
            <div class="form-buttons">
                <button type="submit" class="submit-btn-edit-task">Edit Task</button>
                <button type="button" class="cancel">Cancel</button>
            </div>
        </form>
    </div>
</div>


<!-- Add Employee Modal -->
<div id="addEmployeeModal" class="modal">
    <div class="modal-content">
        <button class="close">&times;</button>
        <div class="modal-header">
            <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
            <h2>Add Employee</h2>
        </div>
        <form id="addEmployeeForm">
            <div class="form-container">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required>
                </div>
                <div class="form-group">
                    <label for="position">Position</label>
                    <select id="position" name="position" required>
                        <option value="">Select Position</option>
                        <option value="Fruit Picker">Fruit Picker</option>
                        <option value="Farm Worker">Farm Worker</option>
                        <option value="Farm Supervisor">Farm Supervisor</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dailyRate">Daily Rate (₱)</label>
                    <input type="number" id="dailyRate" name="dailyRate" required>
                </div>
                <div class="form-group">
                    <label for="daysWorked">Days Worked</label>
                    <input type="number" id="daysWorked" name="daysWorked" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" name="contact" pattern="[0-9]+" required>
                </div>
                <div class="form-group">
                    <label for="employeeStatus">Status</label>
                    <select id="employeeStatus" name="employeeStatus" class="status-select" required>
                        <option value="active" class="status-option-active">Active</option>
                        <option value="onleave" class="status-option-leave">On Leave</option>
                        <option value="inactive" class="status-option-inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div class="form-buttons">
                <button type="submit" class="submit-btn">Add Employee</button>
                <button type="button" class="cancel">Cancel</button>
            </div>
        </form>
    </div>
</div>

<!-- Add Payroll Modal -->
<div id="payrollModal" class="modal">
    <div class="modal-content payroll-modal">
        <button class="close">&times;</button>
        <div class="modal-header">
            <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
            <h2>Employee Payroll</h2>
        </div>
        <div class="payroll-container">  
            <div class="payroll-header">
                <div class="employee-info">
                    <div id="employeeAvatar"></div>
                    <div class="employee-details">
                        <h3 id="employeeName">Loading...</h3>
                        <p id="employeePosition">Loading...</p>
                    </div>
                </div>
                <div class="payroll-actions">
                    <select id="payrollPeriod" class="period-select">
                        <option value="">Select Pay Period</option>
                    </select>
                    <button class="btn-print" onclick="printPayroll()">
                        <i class="fas fa-print"></i> Print Payroll
                    </button>
                </div>
            </div>
            <div id="payrollContent" class="payroll-content">
                <!-- Payroll details will be populated here -->
            </div>
        </div>
    </div>
</div>

<!-- Record Attendance Modal -->
<div id="recordAttendanceModal" class="modal">
    <div class="modal-content record-attendance-modal">
        <div class="modal-header">
            <h2>Record Attendance</h2>
            <button class="close-btn">&times;</button>
        </div>
        <form id="recordAttendanceForm">
            <div class="form-container">
                <div class="form-group">
                    <label for="employeeName">Employee Name</label>
                    <input type="text" id="employeeName" name="employeeName" autocomplete="off" placeholder="Search employee...">
                    <div id="employeeSearchResults" class="search-results"></div>
                </div>
                
                <div class="form-group">
                    <label for="attendanceDate">Date</label>
                    <input type="text" id="attendanceDate" name="attendanceDate" readonly>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="timeIn">Time In</label>
                        <div class="time-input-group">
                            <input type="text" id="timeIn" name="timeIn" placeholder="--:--:-- --" readonly>
                            <button type="button" id="timeInBtn" class="time-btn">Record</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="timeOut">Time Out</label>
                        <div class="time-input-group">
                            <input type="text" id="timeOut" name="timeOut" placeholder="--:--:-- --" readonly>
                            <button type="button" id="timeOutBtn" class="time-btn" disabled>Record</button>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status" required>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                    </select>
                </div>
            </div>
            
            <div class="form-buttons">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="submit-btn">Save</button>
            </div>
        </form>
    </div>
</div>

<!-- Add Item Modal -->
<div id="addItemModal" class="modal">
    <div class="modal-content">
        <button id="closeBtn" class="close">&times;</button>
        <div class="modal-header">
            <img src="/CSE-7/CSE7_Frontend/Assets/logo.png" alt="Logo" width="160">
            <h2>Add New Item</h2>
        </div>
        <form id="addItemForm" method="POST">
            <div class="form-container">
                <div class="form-group">
                    <label for="itemName">Item Name</label>
                    <input type="text" id="itemName" name="itemName" required>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="">Select Category</option>
                        <option value="seeds">Seeds</option>
                        <option value="fertilizers">Fertilizers</option>
                        <option value="tools">Tools</option>
                        <option value="equipment">Equipment</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="currentStock">Initial Stock</label>
                    <input type="number" id="currentStock" name="currentStock" min="0" required>
                </div>
                <div class="form-group">
                    <label for="threshold">Minimum Threshold</label>
                    <input type="number" id="threshold" name="threshold" min="1" required>
                </div>
                <div class="form-group">
                    <label for="supplier">Supplier</label>
                    <select id="supplier" name="supplier" required>
                        <option value="">Select Supplier</option>
                        <option value="Agro Supplies Co.">Agro Supplies Co.</option>
                        <option value="GreenGrow Ltd.">GreenGrow Ltd.</option>
                        <option value="Farm Equipments Inc.">Farm Equipments Inc.</option>
                        <option value="Seeds & More Corp.">Seeds & More Corp.</option>
                        <option value="Organic Fertilizers Plus">Organic Fertilizers Plus</option>
                        <option value="Farm Tools Express">Farm Tools Express</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="unit">Unit of Measurement</label>
                    <select id="unit" name="unit" required>
                        <option value="">Select Unit</option>
                        <option value="pieces">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="g">Grams</option>
                        <option value="l">Liters</option>
                        <option value="bags">Bags</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3"></textarea>
                </div>
            </div>
            <div class="form-buttons">
                <button type="submit" id="submitBtn" class="submit-btn">Add Item</button>
                <button type="button" id="cancelBtn" class="cancel">Cancel</button>
            </div>
        </form>
    </div>
</div>

    <script src="/CSE-7/CSE7_Frontend/javascripts/nav_bar_loader.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/modal.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/sidebar.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/task.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/employee.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/populate_crops.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/attendance.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/search_employee.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/attendance_search.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/resources.js"></script>
</body>
</html>