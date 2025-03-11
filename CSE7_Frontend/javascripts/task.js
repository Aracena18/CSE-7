console.log('Task.js loaded');

// Add autocomplete functionality for employee names
function initializeEmployeeAutocomplete() {
    const assignedToInput = document.getElementById('assignedTo');
    const resultsDiv = document.getElementById('assignedToResults');
    
    if (!assignedToInput || !resultsDiv) return;

    assignedToInput.addEventListener('input', function() {
        const searchTerm = this.value;
        if (searchTerm.length < 2) {
            resultsDiv.innerHTML = '';
            return;
        }

        fetch(`/CSE-7/CSE7_Frontend/employee_folder/search_employees.php?term=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                resultsDiv.innerHTML = '';
                data.forEach(employee => {
                    const div = document.createElement('div');
                    div.className = 'employee-result';
                    div.textContent = employee.name;
                    div.addEventListener('click', () => {
                        assignedToInput.value = employee.name;
                        resultsDiv.innerHTML = '';
                    });
                    resultsDiv.appendChild(div);
                });
            });
    });

    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== assignedToInput) {
            resultsDiv.innerHTML = '';
        }
    });
}

function initializeTaskModal() {
    var modal = document.getElementById("addTaskModal");
    var btn = document.querySelector(".add_btn");
    var closeBtn = document.querySelector(".close_task");
    var cancelBtn = document.querySelector(".cancel");
    var form = document.getElementById("addTaskForm");

    if (modal && btn && closeBtn && form) {
        // Show modal when button is clicked
        btn.onclick = function () {
            console.log('Task button clicked');
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.opacity = 1;
            modal.style.visibility = "visible";
        };

        // Close modal when close button (X) is clicked
        closeBtn.onclick = function () {
            modal.style.display = "none";
            form.reset();
        };

        // Close modal when cancel button is clicked
        if (cancelBtn) {
            cancelBtn.onclick = function () {
                modal.style.display = "none";
                form.reset();
            };
        }

        // Close modal when clicking outside
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                form.reset();
            }
        };

        // *** SINGLE form submission handler ***
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(form);

            fetch("/CSE-7/CSE7_Frontend/tasks_folder/add_task.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Task added successfully!");
                    form.reset();
                    modal.style.display = "none";
                    // Dispatch custom event for task added
                    document.dispatchEvent(new CustomEvent('taskAdded'));
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    } else {
        console.error('One or more task modal elements not found');
    }
}

// Change color function for both priority and status
function changeColor(select) {
    // Remove all existing classes
    select.classList.remove('todo', 'inprogress', 'completed', 'onhold', 'high', 'medium', 'low');
    // Add the selected class
    select.classList.add(select.value);
}

// Initialize dropdowns when task modal content is loaded
document.addEventListener('taskloaded', function() {
    console.log("Task modal loaded");
    
    // Initialize task modal
    initializeTaskModal();
    initializeEditTaskModal(); // Add this line if edit modal initialization exists
    fetchTask();
    // Initialize priority dropdowns
    const prioritySelects = document.querySelectorAll('.priority-select');
    prioritySelects.forEach(select => {
        changeColor(select);
    });

    // Initialize status dropdowns
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        changeColor(select);
    });

    initializeEmployeeAutocomplete();
});

// Listen for task added event to refresh task list
document.addEventListener('taskAdded', function() {
    if (typeof fetchTask === 'function') {
        fetchTask();
    }
});

function fetchTask() {
    fetch("/CSE-7/CSE7_Frontend/tasks_folder/get_tasks.php")
        .then(response => response.json())
        .then(response => {
            if (!response.success) {
                throw new Error(response.message);
            }
            
            const tbody = document.getElementById("tasks_table_body");
            
            if (!tbody) {
                console.error("Task table body element not found!");
                return;
            }
            
            tbody.innerHTML = ""; // Clear existing rows

            response.data.forEach(task => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="description-column">${task.description}</td>
                    <td>${task.assigned_to}</td>
                    <td>${task.location}</td>
                    <td>${formatDate(task.start_date)}</td>
                    <td>${formatDate(task.end_date)}</td>
                    <td>
                        <select class="priority-select" onchange="handlePriorityChange(this, ${task.id})">
                            <option id="high" value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                            <option id="medium" value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option id="low" value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        </select>
                    </td>
                    <td>
                        <span class="status-badge ${task.status}">${getStatusDisplay(task.status)}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    </td>
                `;
                
                tbody.appendChild(row);

                // Initialize colors for newly added row
                const prioritySelect = row.querySelector('.priority-select');;
                
                updatePriorityColor(prioritySelect);

                const editBtn = row.querySelector('.edit-btn');
                if (editBtn) {
                    editBtn.onclick = function() {
                        console.log('Edit button clicked for task:', task.id);
                        editTask(task.id);
                    };
                }
            });
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
            alert("Failed to load tasks. Please try again.");
        });
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Change color function for priority and status
function changePriorityColor(select) {
    select.classList.remove('high', 'medium', 'low');
    select.classList.add(select.value);
}

function changeStatusColor(select) {
    select.classList.remove('todo', 'inprogress', 'completed', 'onhold');
    select.classList.add(select.value);
}

// Initialize dropdowns when modal is opened
document.addEventListener('DOMContentLoaded', function() {
    const prioritySelects = document.querySelectorAll('.priority-select');
    const statusSelects = document.querySelectorAll('.status-select');
    
    prioritySelects.forEach(select => changePriorityColor(select));
    statusSelects.forEach(select => changeStatusColor(select));
});

// Call fetchTask when page loads and when tasks are added/modified
document.addEventListener('DOMContentLoaded', fetchTask);
document.addEventListener('taskAdded', fetchTask);

// Updated color change functions
function updatePriorityColor(select) {
    const value = select.value;
    select.className = 'priority-select';
    select.classList.add(value);

    const styles = {
        high: { color: '#ca0000', background: '#ffeded' },
        medium: { color: '#ca6f00', background: '#fff3e0' },
        low: { color: '#00ca11', background: '#e8f5e9' }
    };

    const style = styles[value] || styles.medium;
    select.style.color = style.color;
    select.style.backgroundColor = style.background;
}

function updateTaskPriority(taskId, priority) {
    fetch(`/CSE-7/CSE7_Frontend/tasks_folder/update_task.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: taskId,
            type: 'priority',
            value: priority
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Priority updated successfully');
            fetchTask();
        } else {
            alert('Failed to update priority: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update priority');
    });
}

function updateTaskStatus(taskId, status) {
    const isCheckbox = typeof status === 'boolean';
    const updateData = isCheckbox ? 
        { id: taskId, type: 'completed', value: status } :
        { id: taskId, type: 'status', value: status };

    fetch(`/CSE-7/CSE7_Frontend/tasks_folder/update_task.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Status updated successfully');
            if (isCheckbox && status === true) {
                const statusSelect = document.getElementById(`status-select-${taskId}`);
                if (statusSelect) {
                    statusSelect.value = "completed";
                    updateStatusColor(statusSelect);
                }
            }
            fetchTask();
        } else {
            alert('Failed to update status: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update status');
    });
}

function updateStatusColor(select) {
    const value = select.value;
    select.className = 'status-select';
    select.classList.add(value);

    const styles = {
        todo: { color: '#5856d6', background: '#eeeeff' },
        inprogress: { color: '#007aff', background: '#e6f2ff' },
        completed: { color: '#4cd964', background: '#e8f5e9' },
        onhold: { color: '#ff9500', background: '#fff3e0' }
    };

    const style = styles[value] || styles.todo;
    select.style.color = style.color;
    select.style.backgroundColor = style.background;
}

function handlePriorityChange(select, taskId) {
    updatePriorityColor(select);
    updateTaskPriority(taskId, select.value);
}

function handleStatusChange(select, taskId) {
    updateStatusColor(select);
    updateTaskStatus(taskId, select.value);
}

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    fetch(`/CSE-7/CSE7_Frontend/tasks_folder/delete_task.php?id=${id}`, { 
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) fetchTask();
    })
    .catch(error => console.error("Error deleting task:", error));
}

function editTask(taskId) {
    if (!taskId) {
        console.error('Task ID is required');
        return;
    }

    console.log('Fetching task with ID:', taskId);

    fetch(`/CSE-7/CSE7_Frontend/tasks_folder/get_task.php?id=${taskId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Received task data:', data);
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch task data');
            }
            
            const taskData = data.task || data.data;
            if (!taskData || !taskData.id) {
                throw new Error('Invalid task data received');
            }

            populateEditTaskForm(taskData);
            openEditTaskModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching task data: ' + error.message);
        });
}

function populateEditTaskForm(task) {
    const form = document.getElementById('EditTaskForm');
    if (!form) {
        console.error('Edit task form not found');
        return;
    }

    console.log('Populating form with task:', task);

    let taskIdInput = form.querySelector('input[name="taskId"]');
    if (!taskIdInput) {
        taskIdInput = document.createElement('input');
        taskIdInput.type = 'hidden';
        taskIdInput.name = 'taskId';
        taskIdInput.id = 'taskId';
        form.appendChild(taskIdInput);
    }

    taskIdInput.value = task.id;
    console.log('Set task ID to:', task.id);

    const fieldMappings = {
        'taskDescription': task.description,
        'assignedTo': task.assigned_to,
        'startDate': task.start_date?.split(' ')[0],
        'endDate': task.end_date?.split(' ')[0],
        'priority': task.priority,
        'status': task.status,
        'taskLocation': task.location
    };

    Object.entries(fieldMappings).forEach(([fieldId, value]) => {
        const input = form.querySelector(`#${fieldId}`);
        if (input) {
            input.value = value || '';
            console.log(`Set ${fieldId} to:`, value);
        } else {
            console.warn(`Field ${fieldId} not found`);
        }
    });

    const prioritySelect = form.querySelector('.priority-select');
    const statusSelect = form.querySelector('.status-select');
    if (prioritySelect) updatePriorityColor(prioritySelect);
    if (statusSelect) updateStatusColor(statusSelect);
}

function openEditTaskModal() {
    const modal = document.getElementById("EditTaskModal");
    if (!modal) return;
    
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
}

function closeEditTaskModal() {
    const modal = document.getElementById("EditTaskModal");
    if (!modal) return;
    
    modal.style.display = "none";
    document.getElementById('EditTaskForm')?.reset();
}

function initializeEditTaskModal() {
    const modal = document.getElementById("EditTaskModal");
    const form = document.getElementById("EditTaskForm");

    if (!modal || !form) {
        console.error('Edit task modal or form not found');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskId = this.querySelector('input[name="taskId"]').value;
        console.log('Submitting form with task ID:', taskId);

        if (!taskId) {
            console.error('Task ID is missing');
            alert('Task ID is missing');
            return;
        }

        const formData = new FormData(this);
        
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        fetch('/CSE-7/CSE7_Frontend/tasks_folder/edit_task.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Task updated successfully!');
                closeEditTaskModal();
                fetchTask();
            } else {
                throw new Error(data.message || 'Update failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating task: ' + error.message);
        });
    });

    const closeBtn = modal.querySelector(".close");
    const cancelBtn = modal.querySelector(".cancel");

    closeBtn?.addEventListener('click', closeEditTaskModal);
    cancelBtn?.addEventListener('click', closeEditTaskModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditTaskModal();
        }
    });
}

// Load crops into select fields when modals are opened
function loadCrops() {
    fetch('/CSE-7/CSE7_Backend/api/crops/get_crops.php')
        .then(response => response.json())
        .then(crops => {
            const cropSelect = document.getElementById('cropSelect');
            const cropSelectEdit = document.getElementById('cropSelectEdit');
            
            cropSelect.innerHTML = '<option value="">Select Crop</option>';
            cropSelectEdit.innerHTML = '<option value="">Select Crop</option>';
            
            crops.forEach(crop => {
                const option = new Option(crop.crop_name, crop.id);
                const optionEdit = new Option(crop.crop_name, crop.id);
                cropSelect.add(option);
                cropSelectEdit.add(optionEdit);
            });
        })
        .catch(error => console.error('Error loading crops:', error));
}

// Load crops when modals are opened
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        loadCrops();
    });
    
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            loadCrops();
        });
    });
});

// Add this helper function to format status display text
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
