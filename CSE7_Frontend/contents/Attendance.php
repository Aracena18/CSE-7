<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/attendance.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>Attendance Management</title>
</head>
<body>
    <div class="attendance-container">
        <!-- Attendance Stats Section -->
        <div class="attendance-stats">
            <div class="stat-card">
                <i class="fas fa-user-check stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Present Today</div>
                    <div class="stat-value" id="presentCount">0</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-user-times stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Absent Today</div>
                    <div class="stat-value" id="absentCount">0</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Late Today</div>
                    <div class="stat-value" id="lateCount">0</div>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-percentage stat-icon"></i>
                <div class="stat-info">
                    <div class="stat-title">Attendance Rate</div>
                    <div class="stat-value" id="attendanceRate">0%</div>
                </div>
            </div>
        </div>

        <!-- Header with Actions -->
        <div class="page-header">
            <h1><i class="fas fa-clipboard-list"></i> Daily Attendance</h1>
            <div class="header-actions">
                <div class="date-picker">
                    <input type="date" id="attendanceDate" class="date-input">
                </div>
                <button class="record-btn" id="recordAttendanceBtn">
                    <i class="fas fa-plus"></i>
                    Record Attendance
                </button>
            </div>
        </div>

        <!-- Attendance Table -->
        <div class="attendance-table-container">
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Status</th>
                        <th>Working Hours</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="attendanceTableBody">
                    <!-- Attendance records will be dynamically populated here -->
                </tbody>
            </table>
        </div>
    </div>

    <script src="/CSE-7/CSE7_Frontend/javascripts/attendance.js"></script>
</body>
</html>
