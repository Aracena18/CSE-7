// Call this function on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today in the date input
    displayCurrentDate();
    
    // Fetch employees (and their attendance) for the default date
    const selectedDate = document.getElementById("attendanceDate").value;
    fetchEmployees(selectedDate);
    
    // Schedule refresh at midnight
    scheduleMidnightRefresh();
    
    // Attach change listener to update attendance when a new date is selected
    const dateInput = document.getElementById("attendanceDate");
    if (dateInput) {
      dateInput.addEventListener('change', () => {
        fetchEmployees(dateInput.value);
      });
    }
  });
    
  // Set the default date (today) in the date input
  function displayCurrentDate() {
    const dateInput = document.getElementById("attendanceDate");
    if (!dateInput) return;
    const today = new Date();
    // Format as YYYY-MM-DD for input type="date"
    const isoDate = today.toISOString().split("T")[0];
    dateInput.value = isoDate;
  }
    
  // Fetch employees (with attendance data for the selected date) from the backend
  async function fetchEmployees(selectedDate = null) {
    try {
      let url = '/CSE-7/CSE7_Frontend/attendance_folder/get_employee_attendance.php';
      if (selectedDate) {
        url += '?date=' + encodeURIComponent(selectedDate);
      }
        
      console.log(url);
      const response = await fetch(url, { credentials: 'include' });
      const data = await response.json();
      console.log('Response from backend:', data);
    
      if (data.success) {
        populateAttendanceTable(data.data);
      } else {
        console.error('Error fetching employees:', data.message);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }
    
  // Populate the attendance table with employee rows and update UI based on attendance data
  function populateAttendanceTable(employees) {
    const tbody = document.getElementById('attendanceList');
    if (!tbody) {
      console.error('Attendance list element not found.');
      return;
    }
    tbody.innerHTML = ''; // Clear existing rows
    
    employees.forEach(employee => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-employee-id', employee.emp_id);
    
      // Mark Time In checkbox
      const tdMarkTimeIn = document.createElement('td');
      const checkboxIn = document.createElement('input');
      checkboxIn.type = 'checkbox';
      checkboxIn.onchange = function() { markTimeIn(employee.emp_id, this); };
      tdMarkTimeIn.appendChild(checkboxIn);
      tr.appendChild(tdMarkTimeIn);
    
      // Mark Time Out checkbox
      const tdMarkTimeOut = document.createElement('td');
      const checkboxOut = document.createElement('input');
      checkboxOut.type = 'checkbox';
      checkboxOut.onchange = function() { markTimeOut(employee.emp_id, this); };
      tdMarkTimeOut.appendChild(checkboxOut);
      tr.appendChild(tdMarkTimeOut);
    
      // Employee Name
      const tdName = document.createElement('td');
      tdName.innerText = employee.name;
      tr.appendChild(tdName);
    
      // Employee Position
      const tdPosition = document.createElement('td');
      tdPosition.innerText = employee.position;
      tr.appendChild(tdPosition);
    
      // Time In display
      const tdTimeIn = document.createElement('td');
      const spanTimeIn = document.createElement('span');
      spanTimeIn.id = `timeIn-${employee.emp_id}`;
      spanTimeIn.innerText = '--';
      tdTimeIn.appendChild(spanTimeIn);
      tr.appendChild(tdTimeIn);
    
      // Time Out display
      const tdTimeOut = document.createElement('td');
      const spanTimeOut = document.createElement('span');
      spanTimeOut.id = `timeOut-${employee.emp_id}`;
      spanTimeOut.innerText = '--';
      tdTimeOut.appendChild(spanTimeOut);
      tr.appendChild(tdTimeOut);
    
      // Status cell
      const tdStatus = document.createElement('td');
      tdStatus.id = `status-${employee.emp_id}`;
      tdStatus.innerText = 'Absent';
      tr.appendChild(tdStatus);
    
      // Update the row if attendance data exists
      if (employee.attendance) {
        if (employee.attendance.time_in) {
          spanTimeIn.innerText = employee.attendance.time_in;
          checkboxIn.checked = true;
        }
        if (employee.attendance.time_out) {
          spanTimeOut.innerText = employee.attendance.time_out;
          checkboxOut.checked = true;
        }
        if (employee.attendance.status) {
          tdStatus.innerText = employee.attendance.status;
        }
      }
    
      tbody.appendChild(tr);
    });
  }
    
  // Function to update attendance when the Time In checkbox is toggled
  async function markTimeIn(employeeId, checkbox) {
    const timeInField = document.getElementById('timeIn-' + employeeId);
    const statusField = document.getElementById('status-' + employeeId);
    const dateInput = document.getElementById("attendanceDate");
    const selectedDate = dateInput ? dateInput.value : null;
    
    if (checkbox.checked) {
      try {
        const response = await fetch('/CSE-7/CSE7_Frontend/attendance_folder/update_attendance.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            employee_id: employeeId,
            attendance_date: selectedDate,
            action: 'time_in'
          })
        });
        const data = await response.json();
        console.log("Mark Time In response:", data);
        if (data.success) {
          timeInField.innerText = data.data.time_in;
          statusField.innerText = 'Present';
        } else {
          alert("Error marking Time In: " + data.message);
          checkbox.checked = false;
        }
      } catch (error) {
        console.error("Error updating Time In:", error);
        alert("An error occurred while updating Time In.");
        checkbox.checked = false;
      }
    } else {
      // Optionally, handle unchecking (if desired)
      timeInField.innerText = '--';
      statusField.innerText = 'Absent';
    }
  }
    
  // Function to update attendance when the Time Out checkbox is toggled
  async function markTimeOut(employeeId, checkbox) {
    const timeOutField = document.getElementById('timeOut-' + employeeId);
    const timeInField = document.getElementById('timeIn-' + employeeId);
    const dateInput = document.getElementById("attendanceDate");
    const selectedDate = dateInput ? dateInput.value : null;
    
    // Check if Time In has been recorded in the UI
    if (timeInField.innerText === '--') {
      alert("Please mark Time In before recording Time Out.");
      checkbox.checked = false;
      return;
    }
    
    if (checkbox.checked) {
      try {
        const response = await fetch('/CSE-7/CSE7_Frontend/attendance_folder/update_attendance.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            employee_id: employeeId,
            attendance_date: selectedDate,
            action: 'time_out'
          })
        });
        const data = await response.json();
        console.log("Mark Time Out response:", data);
        if (data.success) {
          timeOutField.innerText = data.data.time_out;
        } else {
          alert("Error marking Time Out: " + data.message);
          checkbox.checked = false;
        }
      } catch (error) {
        console.error("Error updating Time Out:", error);
        alert("An error occurred while updating Time Out.");
        checkbox.checked = false;
      }
    } else {
      timeOutField.innerText = '--';
    }
  }
    
  // Schedule a refresh of the attendance table at midnight
  function scheduleMidnightRefresh() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
      const dateInput = document.getElementById("attendanceDate");
      const selectedDate = dateInput ? dateInput.value : null;
      fetchEmployees(selectedDate);
      scheduleMidnightRefresh();
    }, timeUntilMidnight);
  }
  