document.addEventListener("DOMContentLoaded", function () {
    // Initialize variables
    const tasksList = document.getElementById("employeeTaskList");
    const taskStatusFilter = document.getElementById("taskStatusFilter");
    const taskUpdateModal = document.getElementById("taskUpdateModal");
    const taskUpdateForm = document.getElementById("taskUpdateForm");
    let currentTaskId = null;

    // Load initial data
    fetchTasks();
    setupEventListeners();
    updateDateTime();

    // Setup event listeners
    function setupEventListeners() {
        // Navigation links
        document.querySelectorAll(".sidebar-nav a").forEach(link => {
            link.addEventListener("click", handleNavigation);
        });

        // Task filtering
        taskStatusFilter.addEventListener("change", filterTasks);

        // Modal close
        document.querySelector(".close-modal").addEventListener("click", () => {
            taskUpdateModal.style.display = "none";
        });

        // Form submission for task update
        taskUpdateForm.addEventListener("submit", handleTaskUpdate);

        // Sidebar toggle
        document.getElementById("sidebarToggle").addEventListener("click", toggleSidebar);
    }

    // Fetch tasks from the backend
    async function fetchTasks() {
        try {
            const response = await fetch("/CSE-7/CSE7_Frontend/tasks_folder/get_task_for_employees.php");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success && Array.isArray(data.tasks)) {
                console.log("Fetched Tasks:", data.tasks);
                renderTasks(data.tasks);
                updateTaskCounts(data.tasks);
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    // Render tasks dynamically into the DOM
    function renderTasks(tasks) {
        tasksList.innerHTML = tasks.map(task => `
            <div class="task-card ${task.status.toLowerCase()}" data-task-id="${task.id}">
                <div class="task-header">
                    <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
                    <span class="status-badge ${task.status}">${getStatusDisplay(task.status)}</span>
                </div>
                <h3 class="task-title">${task.crops}</h3>
                <div class="task-description">${task.description}</div>
                <div class="task-info">
                    <div class="info-item"><i class="fas fa-calendar"></i> Due: ${task.end_date}</div>
                    <div class="info-item"><i class="fas fa-map-marker-alt"></i> ${task.location}</div>
                    <div class="info-item"><i class="fas fa-user"></i> ${task.assignedBy}</div>
                </div>
                <div class="task-actions">${getActionButton(task)}</div>
            </div>
        `).join("");
        animateCards();
    }

    // Map status values to display text
    function getStatusDisplay(status) {
        const statusMap = {
            pending: "NEW TASK",
            in_progress: "IN PROGRESS",
            for_review: "PENDING REVIEW",
            approved: "COMPLETED",
            rejected: "REJECTED"
        };
        return statusMap[status] || status.toUpperCase();
    }

    // Return the appropriate action button based on task status
    function getActionButton(task) {
        switch (task.status) {
            case "pending":
                return `<button onclick="acceptTask('${task.id}')" class="update-btn">
                    <i class="fas fa-play"></i> Accept Task
                </button>`;
            case "in_progress":
                return `<button onclick="openTaskUpdate('${task.id}')" class="update-btn">
                    <i class="fas fa-check"></i> Mark as Done
                </button>`;
            case "for_review":
                return `<button disabled class="update-btn pending-approval">
                    <i class="fas fa-clock"></i> Waiting for Review
                </button>`;
            case "approved":
                return `<button disabled class="update-btn completed">
                    <i class="fas fa-check-circle"></i> Completed
                </button>`;
            case "rejected":
                return `<button onclick="openTaskUpdate('${task.id}')" class="update-btn rejected">
                    <i class="fas fa-redo"></i> Resubmit
                </button>`;
            default:
                return "";
        }
    }

    // Accept task (update status to "in_progress")
    window.acceptTask = async function (taskId) {
        try {
            const response = await fetch(`/CSE-7/CSE7_Frontend/tasks_folder/update_task_status.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task_id: taskId, status: "in_progress" })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fetchTasks(); // Reload tasks after status update
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    // Open task update modal for tasks that need further action
    window.openTaskUpdate = function (taskId) {
        currentTaskId = taskId;
        taskUpdateModal.style.display = "block";
    };

    // Handle task update submission (e.g., when marking a task as done with proof)
    async function handleTaskUpdate(e) {
        e.preventDefault();
        const formData = new FormData(taskUpdateForm);
        formData.append("task_id", currentTaskId);

        try {
            const response = await fetch(`/CSE-7/CSE7_Frontend/tasks_folder/submit_task_update.php`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            taskUpdateModal.style.display = "none";
            fetchTasks(); // Reload tasks after update
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    // Update the task count displays
    function updateTaskCounts(tasks) {
        document.getElementById("pendingCount").textContent = tasks.filter(t => t.status === "pending").length;
        document.getElementById("inProgressCount").textContent = tasks.filter(t => t.status === "in_progress").length;
        document.getElementById("completedCount").textContent = tasks.filter(t => t.status === "approved").length;
    }

    // Filter tasks based on the selected status filter
    function filterTasks() {
        const status = taskStatusFilter.value;
        document.querySelectorAll(".task-card").forEach(card => {
            if (status === "all" || card.classList.contains(status)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Handle navigation between sections
    function handleNavigation(e) {
        e.preventDefault();
        const section = this.getAttribute("data-section");

        document.querySelectorAll(".sidebar-nav a").forEach(link => link.classList.remove("active"));
        this.classList.add("active");

        document.querySelectorAll(".content-section").forEach(sec => sec.style.display = "none");
        document.getElementById(`${section}Section`).style.display = "block";

        document.querySelector(".page-title").textContent = section === "tasks" ? "My Tasks" : "Time Record";
    }

    // Toggle the sidebar display
    function toggleSidebar() {
        document.querySelector(".sidebar").classList.toggle("active");
    }

    // Update the current date display
    function updateDateTime() {
        const dateElement = document.getElementById("currentDate");
        if (dateElement) {
            dateElement.textContent = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    }

    // Animate task cards on render
    function animateCards() {
        document.querySelectorAll(".task-card").forEach((card, index) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
                card.style.transition = "all 0.3s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, index * 100);
        });
    }
});
