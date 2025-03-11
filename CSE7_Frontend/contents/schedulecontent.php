<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" />
    <link rel="stylesheet" href="../CSE7_Frontend/css/content.css">
    <link rel="stylesheet" href="../CSE7_Frontend/css/task.css">
    <title>Schedule Content</title>
    
</head>
<body>
    <section class="schedule_content">
        <div class="contents">
            <div class="header_part">
                <div class="headercontainer">
                    <h2>Task</h2>
                </div>
                <div class="menus">
                    <div class="navigation_schedule">
                        <div class="nav2">
                            <div class="li2"><a href="#">Lists</a></div>
                            <div class="li2"><a href="#">Calendar</a></div>
                        </div>
                    </div>

                    <div class="search_box_container">
                        <input type="text" class="search-box" placeholder="Search">
                    </div>

                    <div class="buttons">
                        <button class="button3">Filter</button>
                        <button class="button4">Sort</button>
                    </div>
                </div>
            </div>
            <button class="add_btn" onclick="initializeTaskModal()">Add Task</button>

            <div class="table-container">
                <table class="tasks-table">
                    <thead>
                        <tr>
                            <th class="description-column">Description</th>
                            <th>Assigned To</th>
                            <th>Location</th>  <!-- Added Location column -->
                            <th>Start</th>
                            <th>End</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tasks_table_body">
                        <tr>
                            <td class="checkbox-column">
                                <input type="checkbox" class="task-checkbox">
                            </td>
                            <td class="description-column">Fertilize the tomato</td>
                            <td>Robert John</td>
                            <td>Field 1</td>  <!-- Added Location data -->
                            <td>02/06/2025</td>
                            <td>02/06/2025</td>
                            <td>
                                <select class="priority-select" onchange="changeColor(this)">
                                    <option value="high" class="high">High</option>
                                    <option value="medium" class="medium">Medium</option>
                                    <option value="low" class="low">Low</option>
                                </select>
                            </td>
                               
                            <td>
                                <select class="status-select" onchange="changeColor(this)">
                                    <option value="todo" class="todo">To Do</option>
                                    <option value="inprogress" class="inprogress">In Progress</option>
                                    <option value="completed" class="completed">Completed</option>
                                    <option value="onhold" class="onhold">On Hold</option>
                                </select>
                            </td>
                            <td >
                                <div class="action-buttons">
                                    <button class="edit-btn" style="cursor: pointer; " type="button">Edit</button>
                                    <button class="delete-btn" style="cursor: pointer;" type="button">Delete</button>
                                </div>

                            </td>
                            
                        </tr>
                        <!-- Add more rows as needed -->
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <script src="/CSE-7/CSE7_Frontend/javascripts/task.js"></script>
</body>
</html>