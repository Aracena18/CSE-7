<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Farm Management System</title>
  <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/dashboard_modern.css">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <!-- Optional Modal CSS -->
  <style>
    /* Image Preview Modal Styles */
    .modal {
      display: none; /* Hidden by default */
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.9);
    }
    .modal-content {
      margin: auto;
      display: block;
      width: 80%;
      max-width: 700px;
    }
    .modal-close {
      position: absolute;
      top: 20px;
      right: 35px;
      color: #fff;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
    }
    @media screen and (max-width: 700px) {
      .modal-content {
        width: 100%;
      }
    }
  </style>
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
            <a href="#" data-section="attendance" class="active">
              <i class="fas fa-users"></i>
              <span>Workforce</span>
            </a>
          </li>
          <li>
            <a href="#" data-section="acceptedTasks">
              <i class="fas fa-seedling"></i>
              <span>Farm Tasks</span>
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
          <h1 class="page-title">Attendance Management</h1>
        </div>

        <div class="header-right">
          <div class="search-container">
            <input type="text" placeholder="Search..." class="search-input" id="searchInput">
            <i class="fas fa-search search-icon"></i>
          </div>
          
          <div class="date-picker">
            <i class="fas fa-calendar"></i>
            <input type="date" id="dateFilter">
          </div>

          <div class="user-profile">
            <span class="username">John Doe</span>
            <img src="../assets/images/profile-placeholder.jpg" alt="Profile" class="profile-image">
          </div>
        </div>
      </header>

      <div class="content-wrapper">
        <!-- Attendance Section -->
        <section id="attendanceSection" class="content-section active">
            <div class="stats-cards">
                <div class="stat-card">
                <div class="stat-icon present">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-details">
                    <span class="stat-value" id="presentCount">25</span>
                    <span class="stat-label">Present Today</span>
                </div>
                </div>
                <div class="stat-card">
                <div class="stat-icon absent">
                    <i class="fas fa-user-times"></i>
                </div>
                <div class="stat-details">
                    <span class="stat-value" id="absentCount">3</span>
                    <span class="stat-label">Absent Today</span>
                </div>
                </div>
                <div class="stat-card">
                <div class="stat-icon late">
                    <i class="fas fa-user-clock"></i>
                </div>
                <div class="stat-details">
                    <span class="stat-value" id="lateCount">2</span>
                    <span class="stat-label">Late Today</span>
                </div>
                </div>
            </div>


            <div class="attendance-table">
            <div class="table-header">
                <h2><i class="fas fa-users"></i> Daily Attendance</h2>
                <!-- Replace static date display with a date input -->
                <div class="header-date">
                <input type="date" id="attendanceDate" />
                </div>
                <div class="table-actions">
                <select id="statusFilter" class="status-filter">
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                </select>
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Mark Time In</th>
                    <th>Mark Time Out</th>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody id="attendanceList">
                <!-- Employee rows generated dynamically -->
                <tr data-employee-id="1">
                    <td>
                    <input type="checkbox" onchange="markTimeIn(1, this)" />
                    </td>
                    <td>
                    <input type="checkbox" onchange="markTimeOut(1, this)" />
                    </td>
                    <td>John Doe</td>
                    <td>Farm Worker</td>
                    <td><span id="timeIn-1">--</span></td>
                    <td><span id="timeOut-1">--</span></td>
                    <td id="status-1">Absent</td>
                </tr>
                <!-- More rows... -->
                </tbody>
            </table>
            </div>

            </section>

        <!-- Accepted Tasks Section -->
        <section id="acceptedTasksSection" class="content-section" style="display: none;">
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon pending">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-details">
                <span class="stat-value" id="pendingTasksCount">8</span>
                <span class="stat-label">Pending Review</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon completed">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-details">
                <span class="stat-value" id="completedTasksCount">15</span>
                <span class="stat-label">Completed Today</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon rejected">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="stat-details">
                <span class="stat-value" id="rejectedTasksCount">2</span>
                <span class="stat-label">Rejected</span>
              </div>
            </div>
          </div>

          <div class="tasks-overview">
            <div class="table-header">
              <h2><i class="fas fa-tasks"></i> Task Review Queue</h2>
              <div class="table-actions">
                <div class="filter-group">
                  <select id="taskStatusFilter" class="status-filter">
                    <option value="all">All Status</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select id="taskTypeFilter" class="status-filter">
                    <option value="all">All Types</option>
                    <option value="harvest">Harvest</option>
                    <option value="planting">Planting</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <input type="text" id="taskSearch" placeholder="Search tasks..." class="search-input">
                </div>
              </div>
            </div>
            
            <div class="tasks-grid">
              <div id="supervisorTasksList" class="task-cards-container">
                <!-- Task Card 1 -->
                <div class="task-card">
                  <div class="task-header">
                    <span class="task-priority high">High Priority</span>
                    <span class="status-badge pending">Pending Review</span>
                  </div>
                  <h3 class="task-title">Harvest Tomatoes - Section A</h3>
                  <div class="task-info">
                    <div class="info-item"><i class="fas fa-user"></i> John Doe</div>
                    <div class="info-item"><i class="fas fa-calendar"></i> 2024-02-15</div>
                    <div class="info-item"><i class="fas fa-clock"></i> 2:30 PM</div>
                  </div>
                  <div class="task-description">
                    Harvested 250kg of tomatoes from Section A. All quality standards met.
                  </div>
                  <div class="task-proof">
                    <div class="proof-images">
                      <img src="/CSE-7/taskimages/task1.jpg" alt="Harvest Proof" class="proof-img" onclick="openImagePreview(this.src)">
                      <img src="/CSE-7/taskimages/task1.jpg" alt="Harvest Proof" class="proof-img" onclick="openImagePreview(this.src)">
                    </div>
                  </div>
                  <div class="task-feedback">
                    <textarea placeholder="Enter feedback for the worker..." rows="2"></textarea>
                  </div>
                  <div class="task-actions">
                    <button class="approve-btn"><i class="fas fa-check"></i> Approve</button>
                    <button class="reject-btn"><i class="fas fa-times"></i> Reject</button>
                  </div>
                </div>

                <!-- Task Card 2 -->
                <div class="task-card">
                  <div class="task-header">
                    <span class="task-priority medium">Medium Priority</span>
                    <span class="status-badge completed">Completed</span>
                  </div>
                  <h3 class="task-title">Plant New Seedlings - Block B</h3>
                  <div class="task-info">
                    <div class="info-item"><i class="fas fa-user"></i> Maria Garcia</div>
                    <div class="info-item"><i class="fas fa-calendar"></i> 2024-02-15</div>
                    <div class="info-item"><i class="fas fa-clock"></i> 11:45 AM</div>
                  </div>
                  <div class="task-description">
                    Planted 500 cucumber seedlings in Block B. Irrigation system checked.
                  </div>
                  <div class="task-proof">
                    <div class="proof-images">
                      <img src="planting1.jpg" alt="Planting Proof" class="proof-img" onclick="openImagePreview(this.src)">
                    </div>
                  </div>
                  <div class="task-feedback">
                    <p class="feedback-approved">✓ Approved: Excellent work on spacing and depth control</p>
                  </div>
                </div>

                <!-- Task Card 3 -->
                <div class="task-card">
                  <div class="task-header">
                    <span class="task-priority low">Low Priority</span>
                    <span class="status-badge rejected">Rejected</span>
                  </div>
                  <h3 class="task-title">Irrigation System Maintenance</h3>
                  <div class="task-info">
                    <div class="info-item"><i class="fas fa-user"></i> Alex Chen</div>
                    <div class="info-item"><i class="fas fa-calendar"></i> 2024-02-14</div>
                    <div class="info-item"><i class="fas fa-clock"></i> 4:15 PM</div>
                  </div>
                  <div class="task-description">
                    Performed maintenance check on irrigation system in Section C.
                  </div>
                  <div class="task-proof">
                    <div class="proof-images">
                      <img src="maintenance1.jpg" alt="Maintenance Proof" class="proof-img" onclick="openImagePreview(this.src)">
                    </div>
                  </div>
                  <div class="task-feedback">
                    <p class="feedback-rejected">✗ Rejected: Incomplete inspection. Please check all zones.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Preview Modal -->
            <div id="imagePreviewModal" class="modal">
              <span class="modal-close">&times;</span>
              <img class="modal-content" id="previewImage">
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  <!-- Sidebar & Navigation Functionality -->
  <script src="/CSE-7/CSE7_Frontend/javascripts/supervisor_attendance.js"></script>
  <script src="/CSE-7/CSE7_Frontend/javascripts/dashboard.js"></script>
  <!--<script src="/CSE-7/CSE7_Frontend/javascripts/dashboard.js"></script>-->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Toggle sidebar visibility
      const sidebarToggle = document.getElementById('sidebarToggle');
      const sidebar = document.querySelector('.sidebar');
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
      });

      // Sidebar navigation: show corresponding section based on data-section attribute
      const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
      const contentSections = document.querySelectorAll('.content-section');
      const pageTitle = document.querySelector('.page-title');
      
      navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          // Remove active class from all links and add to the clicked link
          navLinks.forEach(item => item.classList.remove('active'));
          this.classList.add('active');
          
          // Hide all sections and then show the targeted section
          contentSections.forEach(section => section.style.display = 'none');
          const sectionId = this.getAttribute('data-section') + 'Section';
          const activeSection = document.getElementById(sectionId);
          if (activeSection) {
            activeSection.style.display = 'block';
          }
          
          // Update page title based on selected section
          if (this.getAttribute('data-section') === 'acceptedTasks') {
            pageTitle.textContent = 'Task';
          } else if (this.getAttribute('data-section') === 'attendance') {
            pageTitle.textContent = 'Attendance Management';
          }
        });
      });
    });
    
    // Image Preview Functionality
    function openImagePreview(src) {
      const modal = document.getElementById("imagePreviewModal");
      const modalImg = document.getElementById("previewImage");
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.visibility = "visible";
      modal.style.opacity
      modalImg.src = src;
    }
    
    // Close the modal when clicking the close button or outside the image
    document.addEventListener('DOMContentLoaded', function() {
      const modal = document.getElementById("imagePreviewModal");
      const closeModal = document.querySelector(".modal-close");
      
      closeModal.addEventListener('click', function() {
        modal.style.display = "none";
      });
      
      // Optional: Close modal when clicking outside the image
      modal.addEventListener('click', function(e) {
        if(e.target === modal) {
          modal.style.display = "none";
        }
      });
    });
  </script>
  
  
</body>
</html>
