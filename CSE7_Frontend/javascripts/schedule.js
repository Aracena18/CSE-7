class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.selectedDate = null;
        this.init();
    }

    init() {
        this.initializeElements();
        this.attachEventListeners();
        this.fetchEvents();
        this.renderCalendar();
    }

    initializeElements() {
        this.calendarBody = document.getElementById('calendarBody');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
        this.addEventBtn = document.querySelector('.add-event-btn');
        this.modal = document.getElementById('eventModal');
        this.eventForm = document.getElementById('eventForm');

        // Add more element references
        this.listView = document.getElementById('listView');
        this.eventsList = document.getElementById('eventsList');
        this.eventSearch = document.querySelector('.search-wrapper input');
        this.filterSelect = document.querySelector('.filter-select');
    }

    attachEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.addEventBtn.addEventListener('click', () => this.openModal());
        this.eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal with close button
        document.querySelector('.close-btn').addEventListener('click', () => this.closeModal());
        document.querySelector('.cancel-btn').addEventListener('click', () => this.closeModal());

        // Add event search functionality
        this.eventSearch.addEventListener('input', (e) => this.filterEvents(e.target.value));
        this.filterSelect.addEventListener('change', (e) => this.filterByType(e.target.value));
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.changeMonth(-1);
            if (e.key === 'ArrowRight') this.changeMonth(1);
        });
    }

    async fetchEvents() {
        try {
            const response = await fetch('/CSE-7/CSE7_Frontend/tasks_folder/get_tasks.php');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Error fetching tasks');
            }

            // Convert tasks into calendar events
            this.events = result.data.map(task => ({
                id: task.id,
                title: task.description,
                start: new Date(task.start_date),
                end: new Date(task.end_date),
                type: this.getPriorityType(task.priority),
                description: `Assigned to: ${task.assigned_to}\nLocation: ${task.location}\nStatus: ${task.status}`,
                status: task.status,
                priority: task.priority,
                assignedTo: task.assigned_to,
                location: task.location
            }));

            this.renderCalendar();
            this.renderListView();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            this.showNotification('Failed to load tasks', 'error');
        }
    }

    getPriorityType(priority) {
        const types = {
            high: 'urgent',
            medium: 'normal',
            low: 'low'
        };
        return types[priority] || 'normal';
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update header with formatted date
        this.currentMonthElement.textContent = new Date(year, month)
            .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        this.calendarBody.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Generate calendar grid
        let date = 1;
        const weeks = Math.ceil((firstDay + daysInMonth) / 7);

        for (let i = 0; i < weeks; i++) {
            const row = document.createElement('div');
            row.style.display = 'contents';

            for (let j = 0; j < 7; j++) {
                const cell = this.createCalendarCell(date, firstDay, daysInMonth, year, month, today);
                this.calendarBody.appendChild(cell);

                if (i === 0 && j >= firstDay || i > 0 && date <= daysInMonth) {
                    date++;
                }
            }
        }
    }

    createCalendarCell(date, firstDay, daysInMonth, year, month, today) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';

        // Empty cell logic
        if ((date === 1 && firstDay > 0) || date > daysInMonth) {
            return cell;
        }

        // Current date cell
        const cellDate = new Date(year, month, date);
        if (cellDate.toDateString() === today.toDateString()) {
            cell.classList.add('today');
        }

        // Add date number and events container
        cell.innerHTML = `
            <div class="day-number">${date}</div>
            <div class="day-events"></div>
        `;

        // Add events for this day
        const dayEvents = this.getEventsForDate(cellDate);
        if (dayEvents.length > 0) {
            const eventsContainer = cell.querySelector('.day-events');
            dayEvents.forEach(event => {
                const eventElement = this.createEventElement(event);
                eventsContainer.appendChild(eventElement);
            });
        }

        // Add click handler
        cell.addEventListener('click', () => {
            this.selectedDate = cellDate;
            this.openModal();
        });

        return cell;
    }

    createEventElement(event) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        eventDiv.classList.add(`priority-${event.priority}`);
        eventDiv.classList.add(`status-${event.status}`);
        
        // Create event content
        eventDiv.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-meta">
                <span class="event-time">${this.formatTime(event.start)}</span>
                ${event.assignedTo ? `<span class="event-assignee">👤 ${event.assignedTo}</span>` : ''}
            </div>
        `;
        
        // Enhanced tooltip
        eventDiv.title = `
            ${event.title}
            Time: ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}
            Priority: ${event.priority}
            Status: ${event.status}
            ${event.description}
        `.trim();

        // Add click handler for event details
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEventDetails(event);
        });

        return eventDiv;
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    getEventColor(type) {
        const colors = {
            task: 'rgba(0, 70, 32, 0.1)',
            meeting: '#e3f2fd',
            reminder: '#fff3e0'
        };
        return colors[type] || colors.task;
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    openModal(date = null) {
        this.modal.style.display = 'block';
        if (date) {
            const startInput = document.getElementById('eventStart');
            startInput.value = date.toISOString().slice(0, 16);
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.eventForm.reset();
    }

    async handleEventSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const eventData = {
            title: formData.get('eventTitle'),
            start: new Date(formData.get('eventStart')),
            end: new Date(formData.get('eventEnd')),
            type: formData.get('eventType'),
            description: formData.get('eventDescription')
        };

        try {
            const response = await fetch('/CSE-7/api/events.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                await this.fetchEvents();
                this.closeModal();
                this.showNotification('Event created successfully');
            } else {
                throw new Error('Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            this.showNotification('Failed to create event', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    renderListView() {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';

        const sortedEvents = [...this.events].sort((a, b) => a.start - b.start);

        sortedEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-list-item';
            eventElement.innerHTML = `
                <div class="event-list-header">
                    <span class="event-type ${event.type}">${event.type}</span>
                    <span class="event-date">${event.start.toLocaleDateString()}</span>
                </div>
                <h3>${event.title}</h3>
                <p>${event.description || ''}</p>
            `;
            eventsList.appendChild(eventElement);
        });
    }

    openEventDetails(event) {
        // Create and show a modal with event details
        const detailsHTML = `
            <div class="event-details">
                <h3>${event.title}</h3>
                <div class="detail-row">
                    <span class="label">Start:</span>
                    <span>${event.start.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="label">End:</span>
                    <span>${event.end.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Priority:</span>
                    <span class="priority-badge ${event.priority}">${event.priority}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span class="status-badge ${event.status}">${event.status}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Assigned To:</span>
                    <span>${event.assignedTo}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Location:</span>
                    <span>${event.location}</span>
                </div>
            </div>
        `;

        // Show details in modal
        const modal = document.getElementById('eventModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = detailsHTML;
        modal.style.display = 'block';
    }

    // Add more helper methods as needed...
}

// Initialize calendar when DOM is loaded
document.addEventListener('ScheduleLoaded', () => {
    new Calendar();
});
