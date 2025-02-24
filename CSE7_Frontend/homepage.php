<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@350&display=swap" />
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/homepage.css">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/modal.css">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/content.css">
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
            <button class="button1"><img src="/CSE-7/CSE7_Frontend/Assets/user.svg" alt=""></button>
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
                    <button type="submit" class="submit-btn">Add Crop</button>
                    <button type="button" class="cancel">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Replace the existing addTaskModal content -->
<div id="addTaskModal" class="modal">
    <div class="modal-content">
        <button class="close">&times;</button>
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
                <div class="form-group full-width">
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

    <script src="/CSE-7/CSE7_Frontend/javascripts/modal.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/sidebar.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/nav_bar_loader.js"></script>
    <script src="/CSE-7/CSE7_Frontend/javascripts/task.js"></script>
    
</body>
</html>