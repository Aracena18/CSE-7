document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const attendanceList = document.getElementById('attendanceList');
    // For supervisor tasks, we target the container with id "supervisorTasksList"
    const tasksList = document.getElementById('supervisorTasksList');
    const employeeSearch = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter'); // For filtering if needed
    const dateFilter = document.getElementById('dateFilter');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
  
    // Set current date (for attendance)
    dateFilter.valueAsDate = new Date();
  
    // Load tasks data
    loadTasksData();
  
    // Event listeners
    employeeSearch.addEventListener('input', filterEmployees);
    statusFilter.addEventListener('change', filterTasks);
    document.getElementById('refreshBtn')?.addEventListener('click', refreshData);
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      document.querySelector('.main-content').classList.toggle('expanded');
    });
  
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  
    // Helper function: decode img_review and return the first image URL (if exists)
    function getProofImage(imgReview) {
      try {
        const images = JSON.parse(imgReview);
        return (Array.isArray(images) && images.length) ? images[0] : '';
      } catch (error) {
        console.error("Error parsing img_review:", error);
        return '';
      }
    }
  
    function loadTasksData() {
      fetch('/CSE-7/CSE7_Frontend/tasks_folder/retrieve_task_supervisor.php')
        .then(response => response.json())
        .then(data => {
          console.log(data); // Debug: view the full response structure
          if (data.success && Array.isArray(data.tasks)) {
            // Filter for tasks with status "for_review"
            const reviewTasks = data.tasks.filter(task => task.status.toLowerCase() === 'for_review');
            renderTasksList(reviewTasks);
          } else {
            console.error('Error or no tasks available:', data.message);
          }
        })
        .catch(error => console.error('Error loading tasks:', error));
    }
  
    // Render task cards for supervisor review
    function renderTasksList(tasks) {
      tasksList.innerHTML = tasks.map(task => {
        // Decode the image field and get the first image URL
        const proofImageUrl = getProofImage(task.img_review);
        return `
          <div class="task-card for_review">
            <div class="task-header">
              <span class="task-priority ${task.priority.toLowerCase()}">${task.priority} Priority</span>
              <span class="status-badge pending">Pending Review</span>
            </div>
            <h5>${task.title}</h5>
            <p>${task.description}</p>
            <div class="task-meta">
              <span><i class="fas fa-user"></i> ${task.assignedBy}</span>
              <span><i class="fas fa-clock"></i> ${task.status}</span>
            </div>
            ${proofImageUrl ? `
              <div class="task-proof">
                <div class="proof-images">
                  <img src="${proofImageUrl}" alt="Task Proof" class="proof-img" onclick="openImagePreview(this.src)">
                </div>
              </div>
            ` : ''}
            <div class="task-feedback">
              <textarea id="feedback-${task.id}" placeholder="Enter feedback for the worker..." rows="2"></textarea>
            </div>
            <div class="task-actions">
              <button class="approve-btn" onclick="handleTaskReview('approve', '${task.id}')">
                <i class="fas fa-check"></i> Approve
              </button>
              <button class="reject-btn" onclick="handleTaskReview('reject', '${task.id}')">
                <i class="fas fa-times"></i> Reject
              </button>
            </div>
          </div>
        `;
      }).join('');
      animateTaskCards();
    }
  
    function filterEmployees() {
      const searchTerm = employeeSearch.value.toLowerCase();
      const rows = attendanceList.getElementsByTagName('tr');
      Array.from(rows).forEach(row => {
        // Assuming employee name is in the third cell (index 2)
        const name = row.cells[2].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? '' : 'none';
      });
    }
  
    // If additional filtering for tasks is needed (e.g., by status)
    function filterTasks() {
      const status = statusFilter.value;
      const cards = document.getElementsByClassName('task-card');
      Array.from(cards).forEach(card => {
        if (status === 'all' || card.classList.contains(status)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  
    function refreshData() {
      // If you also want to refresh attendance, call loadAttendanceData()
      loadTasksData();
    }
  
    // Global function to update attendance (if needed)
    window.updateAttendance = function(employeeId, field, value) {
      console.log(`Updating ${field} for employee ${employeeId} to ${value}`);
      // TODO: Implement the API call to update attendance in the backend
    };
  
    window.handleTimeRecord = function(employeeId, timeType, isChecked) {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      const timeElement = document.getElementById(`${timeType}-${employeeId}`);
      if (isChecked) {
        timeElement.textContent = currentTime;
        updateAttendance(employeeId, timeType, currentTime);
      } else {
        timeElement.textContent = '-';
        updateAttendance(employeeId, timeType, null);
      }
      const timeInElement = document.getElementById(`timeIn-${employeeId}`);
      const hasTimeIn = timeInElement.textContent !== '-';
      updateAttendance(employeeId, 'status', hasTimeIn ? 'Present' : 'Absent');
    };
  
    // Global function to open image preview modal
    window.openImagePreview = function(src) {
      const modal = document.getElementById("imagePreviewModal");
      const modalImg = document.getElementById("previewImage");
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.visibility = "visible";
      modalImg.src = src;
    };
  
    // Close the image preview modal when clicking the close button or outside the image
    document.addEventListener('DOMContentLoaded', function() {
      const modal = document.getElementById("imagePreviewModal");
      const closeModal = document.querySelector(".modal-close");
      closeModal.addEventListener('click', function() {
        modal.style.display = "none";
      });
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    });
  
    // Global function to handle task review (approval/rejection) and send comments to the backend
    window.handleTaskReview = function(action, taskId) {
      // Retrieve the comment for the specific task
      const comment = document.getElementById(`feedback-${taskId}`).value;
      // Prepare the payload
      const payload = {
        task_id: taskId,
        action: action, // Expected values: 'approve' or 'reject'
        taskComments: comment
      };
  
      // Send the POST request to update the task status and comments in the backend
      fetch('/CSE-7/CSE7_Frontend/tasks_folder/update_task_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          // Optionally display a success message here
          loadTasksData(); // Refresh the task list after successful update
        } else {
          console.error('Error updating task review:', data.message);
        }
      })
      .catch(error => console.error('Error updating task review:', error));
    };
  
    // Animate task cards for a smooth appearance
    function animateTaskCards() {
      const cards = document.querySelectorAll('.task-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  });
  