<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Dashboard - Farm Management System</title>
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/dashboard_modern.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="dashboard-wrapper">
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="/CSE-7/CSE7_Frontend/Assets/logo-white.png" alt="Farm Management" class="logo">
                <h3>AgriManager</h3>
            </div>
            
            <nav class="sidebar-nav">
                <ul>  
                    <li>
                        <a href="#" class="active">
                            <i class="fas fa-seedling"></i>
                            <span>My Tasks</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fas fa-chart-line"></i>
                            <span>Progress</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fas fa-user"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="sidebar-footer">
                <a href="/CSE-7/CSE7_Frontend/authentication/logout.php" class="logout-link">
                    <i class="fas fa-sign-out-alt"></i> 
                    <span>Logout</span>
                </a>
            </div>
        </aside>

        <main class="main-content">
            <header class="top-header">
                <div class="header-left">
                    <button id="sidebarToggle" class="sidebar-toggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="header-title">
                        <h1 class="page-title">My Tasks</h1>
                        <p class="current-date" id="currentDate"></p>
                    </div>
                </div>

                <div class="header-right">
                    <div class="search-container">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Search tasks..." class="search-input">
                    </div>
                    <div class="user-profile">
                        <div class="profile-info">
                            <span class="username">John Doe</span>
                            <span class="role">Farm Worker</span>
                        </div>
                        <img src="../assets/images/profile-placeholder.jpg" alt="Profile" class="profile-image">
                    </div>
                </div>
            </header>

            <div class="content-wrapper">
                <div class="dashboard-stats">
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-icon pending">
                                <i class="fas fa-hourglass-half"></i>
                            </div>
                            <div class="stat-details">
                                <span class="stat-value" id="pendingCount">3</span>
                                <span class="stat-label">Pending Tasks</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon in-progress">
                                <i class="fas fa-spinner"></i>
                            </div>
                            <div class="stat-details">
                                <span class="stat-value" id="inProgressCount">2</span>
                                <span class="stat-label">In Progress</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon completed">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="stat-details">
                                <span class="stat-value" id="completedCount">8</span>
                                <span class="stat-label">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tasks-section">
                    <div class="tasks-header">
                        <div class="tasks-header-left">
                            <h2><i class="fas fa-list-check"></i> Task List</h2>
                        </div>
                        <div class="tasks-header-right">
                            <select id="taskStatusFilter" class="status-filter">
                                <option value="all">All Tasks</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select id="taskPriorityFilter" class="priority-filter">
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    <div class="employee-task-grid" id="employeeTaskList">
                        <!-- Task cards will be dynamically populated here -->
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Task Update Modal -->
    <div class="modal" id="taskUpdateModal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Complete Task</h2>
            <form id="taskUpdateForm" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="taskNotes">Completion Notes:</label>
                    <textarea id="taskNotes" name="taskNotes" rows="4" placeholder="Describe how you completed the task..."></textarea>
                </div>
                <div class="form-group">
                    <label for="taskImages">Upload Proof of Work:</label>
                    <div class="file-upload-container">
                    <input type="file" name="taskImages[]" multiple accept="image/*" required>
                        <label for="taskImages" class="file-upload-label">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Click to upload or drag and drop</span>
                        </label>
                    </div>
                    <div id="imagePreview" class="image-preview"></div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-submit">Submit for Approval</button>
                </div>
            </form>
        </div>
    </div>

    <script src="/CSE-7/CSE7_Frontend/javascripts/employee_dashboard.js"></script>
</body>
</html>
