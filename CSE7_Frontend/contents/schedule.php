<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/schedule.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>Schedule</title>
</head>
<body>
    <div class="schedule-container">
        <!-- Header Section -->
        <div class="schedule-header">
            <div class="header-left">
                <h1><i class="fas fa-calendar-alt"></i> Schedule</h1>
                <div class="view-toggles">
                    <button class="view-btn active" data-view="calendar">
                        <i class="fas fa-calendar"></i> Calendar
                    </button>
                    <button class="view-btn" data-view="list">
                        <i class="fas fa-list"></i> List
                    </button>
                </div>
            </div>
            <div class="header-right">
                <div class="date-navigation">
                    <button class="nav-btn" id="prevMonth">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h2 id="currentMonth">February 2025</h2>
                    <button class="nav-btn" id="nextMonth">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <button class="add-event-btn">
                    <i class="fas fa-plus"></i> Add Event
                </button>
            </div>
        </div>

        <!-- Calendar View -->
        <div class="calendar-view" id="calendarView">
            <div class="calendar-grid">
                <div class="calendar-header">
                    <div>Sunday</div>
                    <div>Monday</div>
                    <div>Tuesday</div>
                    <div>Wednesday</div>
                    <div>Thursday</div>
                    <div>Friday</div>
                    <div>Saturday</div>
                </div>
                <div class="calendar-body" id="calendarBody">
                    <!-- Calendar cells will be populated by JavaScript -->
                </div>
            </div>
        </div>

        <!-- List View (initially hidden) -->
        <div class="list-view" id="listView" style="display: none;">
            <div class="list-filters">
                <select class="filter-select">
                    <option value="all">All Events</option>
                    <option value="tasks">Tasks</option>
                    <option value="meetings">Meetings</option>
                </select>
                <div class="search-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search events...">
                </div>
            </div>
            <div class="events-list" id="eventsList">
                <!-- Events will be populated by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Event Modal -->
    <div id="eventModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Event</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <form id="eventForm">
                <div class="form-group">
                    <label>Event Title</label>
                    <input type="text" id="eventTitle" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="datetime-local" id="eventStart" required>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="datetime-local" id="eventEnd" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Event Type</label>
                    <select id="eventType">
                        <option value="task">Task</option>
                        <option value="meeting">Meeting</option>
                        <option value="reminder">Reminder</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="eventDescription"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Save Event</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="/CSE-7/CSE7_Frontend/javascripts/schedule.js"></script>
</body>
</html>