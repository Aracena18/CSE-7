<!-- View Task Modal -->
<div id="viewTaskModal" class="modal">
    <div class="modal-content task-modal">
        <div class="modal-header">
            <div class="employee-info">
                <div id="taskEmployeeAvatar" class="employee-avatar"></div>
                <div class="employee-details">
                    <h3 id="taskEmployeeName"></h3>
                    <p id="taskEmployeePosition"></p>
                </div>
            </div>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <div class="task-filters">
                <select id="taskStatusFilter">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select id="taskDateFilter">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                </select>
            </div>
            <div id="taskList" class="task-list">
                <!-- Tasks will be populated here -->
            </div>
        </div>
    </div>
</div>
